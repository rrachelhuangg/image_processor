// python -m http.server
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
  //need to modify this a bit to download the right imageSrc
  const render = document.getElementById("uploadedPhoto");
  let imageSrc = render.src.slice(0, 100);
  const link = document.createElement("a");
  link.href = imageSrc;
  link.download = imageSrc;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const invert = () => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "imgs/upload.png";
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  console.log(imageData.width);
  for(let i = 0; i < data.length; i+=4){
    data[i] = 255-data[i]; //red
    data[i+1] = 255-data[i+1]; //green
    data[i+2] = 255-data[i+2]; //blue
  }
  ctx.putImageData(imageData,0, 0);
} 

function nbrPixels(pixelIdx, imageData, data){ //gets the neighboring pixels for a pixel
  nbrs = [] // clear array
  nbrs[0] = data[pixelIdx - imageData.width * 4 - 4] // Upper left
  nbrs[1] = data[pixelIdx - imageData.width * 4]     // Upper middle
  nbrs[2] = data[pixelIdx - imageData.width * 4 + 4] // Upper right
  nbrs[3] = data[pixelIdx - 4] // left
  nbrs[4] = data[pixelIdx + 4] // right
  nbrs[5] = data[pixelIdx + imageData.width * 4 - 4] // Lower left
  nbrs[6] = data[pixelIdx + imageData.width * 4]     // lower middle
  nbrs[7] = data[pixelIdx + imageData.width * 4 + 4] // Lower right
  return nbrs;
}

function test(){
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "imgs/dog.jpg";
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for(let i = 0; i < 20; i+=4){ //should test for 5 pixels
    console.log(nbrPixels(i, imageData, data));
  }
}

