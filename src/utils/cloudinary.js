import axios from 'axios';

const presetName = process.env.REACT_APP_CLOUDINARY_PRESET_NAME;
const apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;

const CLOUDINARY_API = axios.create({
  baseURL:
    'https://api.cloudinary.com/v1_1/' + presetName + '/upload',
});

export const uploadSingle = async file => {
  try {
    const result = await CLOUDINARY_API.post('/', {
      file,
      api_key: apiKey,
      upload_preset: presetName,
    });
    return result.data.secure_url;
  } catch (error) {
    throw new Error(
      error.error?.message ||
        error.message ||
        'unknown error occured while uploading file',
    );
  }
};

export const uploadMultiple = async images => {
  const promises = [];

  for (const i in images) {
    promises.push(
      CLOUDINARY_API.post('/', {
        file: images[i],
        api_key: apiKey,
        upload_preset: presetName,
      }),
    );
  }
  const results = await Promise.all(promises);

  return results.map(res => res.data.secure_url);
};