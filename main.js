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