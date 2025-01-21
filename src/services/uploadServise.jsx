
import axioInstence from "../utils/axioInstence";
import axios from "axios";


  const uploadImageToCloudinary = async (files)=>{
     try {
       const {data} = await axioInstence.get('/admin/generate-upload-url')
       const {signature, timestamp, uploadPreset,apiKey}=data


          const imageUrls=[];
          for(const file of files) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset',uploadPreset)
            formData.append('timestamp',timestamp)
            formData.append('signature', signature)
            formData.append('api_key', apiKey); 
 


            
            const response = await axios.post(
              'https://api.cloudinary.com/v1_1/dujuwqvz5/image/upload',
              formData
            )
            console.log('Image uploaded successfully', response.data.secure_url)
            imageUrls.push(response.data.secure_url)
          }     
           return imageUrls
     } catch (error) {
        console.error('Erro uplading image:',error)
     }
  }

  export default uploadImageToCloudinary