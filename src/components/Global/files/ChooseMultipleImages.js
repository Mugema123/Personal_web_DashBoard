import { Button, ImageList, ImageListItem, Typography } from "@mui/material";
import ChooseFileBase64 from "./ChooseFile";

const ChooseMultipleImages = ({ imagesSelected, selected }) => {
  const handleFilesChange = (files) => {
    if (files.length === 0) return;
    imagesSelected(files.map((file) => file.base64));
  };

  return (
    <>
      <Typography>Project Images</Typography>

      <ImageList cols={2} rowHeight={150}>
        {selected.map((file, index) => {
          return (
            <ImageListItem key={index}>
              <img src={`${file}`} alt={file.name} loading="lazy" />
            </ImageListItem>
          );
        })}
      </ImageList>

      <Button variant="contained" component="label">
        {selected.length > 1 ? "Change" : "Choose"} Images
        <ChooseFileBase64
          multiple={true}
          hidden={true}
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFilesChange}
        />
      </Button>
    </>
  );
};

export default ChooseMultipleImages;
