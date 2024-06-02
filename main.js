// python -m http.server: for bypassing CORS protocol on browsers
const fileInput = document.getElementById("uploadImage");
fileInput.addEventListener("change", loadImage);

// Function to load image when input changes**
function loadImage(event) {
  const file = event.target.files[0];
  const image_element = new Image();
  image_element.onload = function() {
      const canvas = document.getElementById("uploadedPhoto");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      var hRatio = canvas.width / this.width;
      var vRatio = canvas.height / this.height;
      var ratio  = Math.min ( hRatio, vRatio );
      context.drawImage(this, this.width/2,this.height/2, this.width, this.height, this.width/2,this.height/2,this.width*ratio, this.height*ratio);
  };
  image_element.src = URL.createObjectURL(file);
}

function removeFile(){
  const canvas_element = document.getElementById("uploadedPhoto");
  const context = canvas_element.getContext("2d");
  context.clearRect(0, 0, canvas_element.width, canvas_element.height);
} 

function downloadImage(){
  let imageSrc = document.getElementById("canvas").toDataURL('image/jpeg', 1);
  const link = document.createElement("a");
  link.href = imageSrc;
  link.download = imageSrc;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const invert = () => {
  const canvas_element = document.getElementById("uploadedPhoto");
  const context = canvas_element.getContext("2d");
  const output = document.getElementById("canvas");
  const cOutput = output.getContext("2d");
  var imageData = context.getImageData(0, 0, canvas_element.width, canvas_element.height);
  var data = imageData.data;
  for(let i = 0; i < data.length; i+=4){
    data[i] = 255-data[i];
    data[i+1] = 255-data[i+1];
    data[i+2] = 255-data[i+2];
  }
  cOutput.putImageData(imageData, 0, 0);
} 

function grayscale(){
  const canvas_element = document.getElementById("uploadedPhoto");
  const context = canvas_element.getContext("2d");
  const output = document.getElementById("canvas");
  const cOutput = output.getContext("2d");
  var imageData = context.getImageData(0, 0, canvas_element.width, canvas_element.height);
  var data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  cOutput.putImageData(imageData, 0, 0);  
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
  const canvas_element = document.getElementById("uploadedPhoto");
  const context = canvas_element.getContext("2d");
  const output = document.getElementById("canvas");
  const cOutput = output.getContext("2d");
  var imageData = context.getImageData(0, 0, canvas_element.width, canvas_element.height);
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
  cOutput.putImageData(imageData, 0, 0); 
}

function edgeDetection(){ 
  let edgeDetectionKernel = [-1, -1, -1, -1, -1, -1, -1, -1, 8]; //formatted so that the center pixel is at the end
  applyKernel(edgeDetectionKernel);
}

function embossing(){
  let embossKernel = [-2,-1,0,-1,1,0,1,2,1]; 
  applyKernel(embossKernel);
}



