// https://p5js.org/examples/image-convolution.html
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

//

function identityKernel(width, height, centerX, centerY){
  let weightArray = [];
  for(var h = 0; h < height; h++){
    weightArray.push([]);
    for(var w = 0; w < width; w++){
      weightArray[h].push(0);
    }
  }
}

const test = () => {
  const imageElement = document.getElementById("uploadedPhoto");
  var width  = imageElement.naturalWidth;
  var height = imageElement.naturalHeight;   
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);
  var image = ctx.getImageData(0, 0, width, height);
  var pix = image.data;
} 


