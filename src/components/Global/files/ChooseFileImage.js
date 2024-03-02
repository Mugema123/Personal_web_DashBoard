import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

const ChooseFileImage = ({ title, onSelect, selected, error }) => {
  // const [selectedImage, setSelectedImage] = useState();

  const handleFileChange = e => {
    const files = e.target.files;
    if (files.length === 0) return;

    // setSelectedImage(files[0]);
    var reader = new FileReader();

    reader.onloadend = function () {
      //Base 64
      onSelect(reader.result);
    };

    if (files[0]) {
      reader.readAsDataURL(files[0]);
    }
  };
  return (
    <Stack sx={{ my: 1 }} alignItems="start" spacing={2}>
      <Typography>{title}</Typography>

      {selected && (
        <img
          src={selected}
          alt="Choosen"
          style={{ objectFit: 'contain', height: 200 }}
        />
      )}
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
      <Button variant="contained" component="label">
        {selected ? 'Change' : 'Upload'} Image
        <input
          type="file"
          hidden
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
        />
      </Button>
    </Stack>
  );
};

export default ChooseFileImage;
