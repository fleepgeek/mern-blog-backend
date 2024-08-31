import { v2 as cloudinary } from "cloudinary";

const folder = "mern_blog";

export const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = image.buffer.toString("base64");
  const imageDataURI = `data:${image.mimetype};base64,${base64Image}`;

  const response = await cloudinary.uploader.upload(imageDataURI, { folder });
  return response.url;
};

export const deleteImage = async (imageUrl: string) => {
  try {
    const pathArray = imageUrl.split("/");
    const name = pathArray[pathArray.length - 1].split(".")[0];
    const publicId = `${folder}/${name}`;
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
  } catch (error) {
    console.log(error);
  }
};
