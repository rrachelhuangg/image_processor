// python -m http.server
//https://blog.j2i.net/2017/11/25/kernel-filters-in-htmljavascript/
//https://stackoverflow.com/questions/70221084/solved-get-neighboring-pixels-from-linear-array-as-in-context-getimagedata
//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
//https://stackoverflow.com/questions/17764012/image-being-clipped-when-copied-to-html-canvas-using-drawimage
//
const uploadButton = document.getElementById("uploadButton")
const removeButton = document.getElementById("removeButton")

const renderFile = () => {
    const render = document.getElementById('uploadedPhoto')
    const file = document.querySelector('input[type=file]').files[0]
    const reader = new FileReader();
    
    reader.addEventListener('load' , ()=> {
      render.src = reader.result;
    }, false)
  
    //file.name is the file name
    if(file){
      reader.readAsDataURL(file);
    }

} 

const removeFile = () => {
  const render = document.getElementById('uploadedPhoto')
  render.src = "imgs/upload.png";
} 

function downloadImage(){
  const render = document.getElementById("uploadedPhoto");
  var canvas = document.getElementById("canvas");
  let imageSrc = canvas.toDataURL('image/jpeg', 1);
  const link = document.createElement("a");
  link.href = imageSrc;
  link.download = imageSrc;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function setImage(image){
  const render = document.getElementById('uploadedPhoto');
  render.src = "imgs/"+image;
  console.log("ENTIRE SOURCE: " + render.src); //local and pushed sources are different so need to slice differently
  // console.log(render.src.slice(22));
}

function getImage(){
  const render = document.getElementById('uploadedPhoto');
  console.log("Get Image SOURCE: " + render.src);
  console.log("Get sliced image source: " + render.src.slice(22));
  if(render.src.slice(22).charAt(0)==="g"){
    return render.src.slice(22).slice(26);
  }
  else{
    return render.src.slice(22);
  }
}

const invert = () => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = getImage();
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  var ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  ctx.drawImage(img, 0, 0, img.width*ratio, img.height*ratio);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  console.log(data.length);
  for(let i = 0; i < data.length; i+=4){
    data[i] = 255-data[i]; //red
    data[i+1] = 255-data[i+1]; //green
    data[i+2] = 255-data[i+2]; //blue
  }
  ctx.putImageData(imageData,0, 0);
} 

function grayscale(){
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = getImage();
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  ctx.drawImage(img, 0, 0, img.width*ratio, img.height*ratio);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  ctx.putImageData(imageData, 0, 0);
}

function nbrPixels(pixelIdx, imageData, data){ //idx values of neighboring pixels
  let nbrIdxs = [];
  nbrIdxs[0] = pixelIdx - imageData.width * 4 - 4; //upper left
  nbrIdxs[1] = pixelIdx - imageData.width * 4; //upper middle
  nbrIdxs[2] = pixelIdx - imageData.width * 4 + 4; //upper right
  nbrIdxs[3] = pixelIdx - 4; //left
  nbrIdxs[4] = pixelIdx + 4; //right
  nbrIdxs[5] = pixelIdx + imageData.width * 4 - 4; //lower left
  nbrIdxs[6] = pixelIdx + imageData.width * 4; //lower middle
  nbrIdxs[7] = pixelIdx + imageData.width * 4 + 4; //lower right
  return nbrIdxs;
}

function applyKernel(kernel){
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = getImage();
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  ctx.drawImage(img, 0, 0, img.width*ratio, img.height*ratio);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  for(let i = 0; i < data.length; i+=4){
    let nbrIdxs = nbrPixels(i, imageData, data);
    data[i] = data[i] * kernel[8];
    data[i+1] = data[i+1] * kernel[8];
    data[i+2] = data[i+2]*kernel[8];
    for(let n = 0; n < nbrIdxs.length; n++){
      let nbrIdx = nbrIdxs[n];
      data[i] = data[i] + (data[nbrIdx]*kernel[n]); //is a temp imageData/data needed?
      data[i+1] = data[i+1] + (data[nbrIdx+1]*kernel[n]);
      data[i+2] = data[i+2] + (data[nbrIdx+2] * kernel[n]);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function edgeDetection(){ 
  let edgeDetectionKernel = [-1, -1, -1, -1, -1, -1, -1, -1, 8]; //formatted so that the center pixel is at the end
  applyKernel(edgeDetectionKernel);
}

function embossing(){
  let embossKernel = [-2,-1,0,-1,1,0,1,2,1]; 
  applyKernel(embossKernel);
}

/** */
const fileInput = document.getElementById("uploadImage");
fileInput.addEventListener("change", loadImage);

// Function to load image when input changes**
function loadImage(event) {
  console.log("In here");
  const file = event.target.files[0];
  const image_element = new Image();
  image_element.onload = function() {
      const canvas_element = document.getElementById("uploadedPhoto");
      const context = canvas_element.getContext("2d");
      canvas_element.width = this.width;
      canvas_element.height = this.height;
      context.drawImage(this, 0, 0);
      var imageData = context.getImageData(0, 0, canvas_element.width, canvas_element.height);
      var data = imageData.data;
      for(let i = 0; i < data.length; i+=4){
          data[i] = 255-data[i];
          data[i+1] = 255-data[i+1];
          data[i+2] = 255-data[i+2];
      }
      context.putImageData(imageData, 0, 0);
  };
  image_element.src = URL.createObjectURL(file);
}

