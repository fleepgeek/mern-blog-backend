import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = image.buffer.toString("base64");
  const imageDataURI = `data:${image.mimetype};base64,${base64Image}`;

  const response = await cloudinary.uploader.upload(imageDataURI);
  return response.url;
};

export default uploadImage;
