import {v2 as cloudinary} from "cloudinary"

export const cloudinaryUpload = async (filePath) => {
     try{
        const result = await cloudinary.uploader.upload(filePath);
        return result.secure_url;
    } catch (error) {
         console.error(`Cloudinary upload failed: ${error}`);
     }
}