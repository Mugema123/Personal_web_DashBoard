import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Typography, Box, LinearProgress } from '@mui/material';
import { Input, Chip } from '@mui/material';
import { IconFileFilled, IconFileText } from '@tabler/icons-react';
import { uploadMultiple, uploadSingle } from 'src/utils/cloudinary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const StyledContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

const StyledInput = styled(Input)(({ theme }) => ({
    position: 'absolute',
    left: '-9999px',
    opacity: 0, 
}));

const StyledFileInput = styled('div')(({ theme, isDragging }) => ({
  backgroundColor: isDragging ? '#008D41' : '#F3F4F6',
  color: isDragging ? 'white' : 'inherit',
  borderRadius: '10px',
  marginBottom: theme.spacing(1),
  marginTop: "5px",
  padding: theme.spacing(0,0,2,0),
  border: '1px solid #ddd', 
  '& .file-input-header': {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 4),
    borderTopLeftRadius: '10px',  
    borderTopRightRadius: '10px',
    '& .file-count': {
      border: '1px solid #000',
      borderRadius: '50%',
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing(0.75, 1.3),
      fontSize: '13px',
    },
    '& .file-button': {
      backgroundColor: 'black',
      color: 'white',
      borderRadius: '10px',
      padding: theme.spacing(0.75, 3),
      outline: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    '& .file-icon': {
      border: '1px solid #000',
      borderRadius: '50%',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing(0.75, 1.3),
    },
  },
  '& .file-error': {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    color: 'red',
    fontSize: '14px',
  },
  '& .file-drop-area': {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing(4, 0),
    borderRadius: '3px',
    cursor: 'pointer',
    '& .file-drop-text': {
      textAlign: 'center',
      fontSize: theme.typography.body2.fontSize,
      '& br': {
        content: '""',
        display: 'block',
        marginTop: theme.spacing(2),
      },
    },
  },
  '& .file-list': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(0, 2),
  },
  '& .file-item': {
    display: 'flex',
    alignItems: 'center',
    gap: "5px",
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 2),
    marginBottom: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    '& .file-icon': {
      color: 'red',
    },
    '& .file-name': {
      fontSize: '12px',
      flexGrow: 1,
      textAlign: 'left',
    },
  },
}));

const ChooseFileField = ({
  label,
  acceptFileTypes = 'application/pdf',
  isMultiple = true, 
  onChange = () => {},
  currentItem,
  currentItemUrl,
  chipLabel
}) => {
  const fieldId = label.split(' ').join('-');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState();
  const [upload, setUpload] = useState({
    uploaded: [],
    uploading: [],
    removed: [],
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragError('');
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const fileTypes = acceptFileTypes.split(',');

    let unaccepted = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const selectedFile = {
          name: file.name,
          url: reader.result,
        };

        if (!fileTypes.includes(file.type)) {
          unaccepted += 1;
        } else {
          if (isMultiple) {
            setSelectedFiles((prev) => [...prev, selectedFile]);
          } else {
            setSelectedFiles([selectedFile]);
          }
        }
      };

      reader.readAsDataURL(file);
    });

    setIsDragging(false);

    if (unaccepted > 0) {
      setDragError(`${unaccepted} files are not accepted, not in allowed format*`);
    }
  };

  const handleClickUpload = (e) => {
    const input = document.getElementById(fieldId);
    setDragError(undefined);
    input.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const selectedFile = {
          name: file.name,
          url: reader.result,
        };
        if (isMultiple) {
          setSelectedFiles((prev) => [...prev, selectedFile]);
        } else {
          setSelectedFiles((prev) => [selectedFile]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const [secureUrls, setSecureUrls] = useState([]);

  useEffect(() => {
    if (selectedFiles.length === 0) return;
    async function uploading() {
      const nonUploaded = selectedFiles.filter(
        (file) => !upload.uploaded.includes(file.name),
      );
      const imageUrls = nonUploaded.map((file) => file.url);
      const imageNames = nonUploaded.map((file) => file.name);

      try {
        setUpload((prev) => ({
          ...prev,
          uploading: [...imageNames],
        }));

        if (!isMultiple) {
          const last = imageUrls[0];
          const img = await uploadSingle(last);
          onChange(img);
        } else if (isMultiple && imageUrls.length > 0) {
          const images = await uploadMultiple(imageUrls);
          onChange([...secureUrls, ...images]);
          setSecureUrls((prev) => [...prev, ...images]);
        }

        setUpload((prev) => ({
          ...prev,
          uploading: [],
          uploaded: [...prev.uploaded, ...imageNames],
        }));
      } catch (error) {
        setDragError(
          error.message ||
            'Something went wrong while uploading ' +
              label.toLowerCase(),
        );
      } finally {
        setUpload((prev) => ({ ...prev, uploading: [] }));
      }
    }
    uploading();
  }, [selectedFiles, isMultiple]);

  return (
    <>
    {
      currentItem && !isMultiple &&
      <a
          href={currentItemUrl}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
      >
          <Chip
          clickable
          icon={<PictureAsPdfIcon />}
          label={chipLabel}
          color="primary"
          />
      </a>
    }
    {
      currentItem && isMultiple && (
      <Box sx={{ display: "flex", gap: "10px" , flexWrap: "wrap" }}>
        {
      currentItemUrl?.map((url, index) => (
      <a
          href={url}
          target="_blank"
          rel="noreferrer"
          key={index}
          style={{ textDecoration: 'none' }}
      >
          <Chip
          clickable
          icon={<PictureAsPdfIcon />}
          label={chipLabel + " " + (index + 1)}
          color="primary"
          />
      </a>
      ))
        }
      </Box>)
    }
    <StyledContainer onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <StyledFileInput>
      <StyledInput
        type="file"
        id={fieldId}
        name={fieldId}
        accept={acceptFileTypes}
        multiple={isMultiple}
        onChange={handleFileChange}
      />
      <Box className="file-input-header">
        {selectedFiles.length === 0 ? (
          <Typography variant="body2"></Typography>
        ) : (
          <Typography variant="body2" className="file-count">
            {selectedFiles.length > 9 ? selectedFiles.length : `0${selectedFiles.length}`}
          </Typography>
        )}
        <Button
          variant="contained"
          className="file-button"
          onClick={handleClickUpload}
        >
          {selectedFiles.length === 0 && !isMultiple
            ? 'Choose File'
            : selectedFiles.length === 0 && isMultiple
            ? 'Choose Files'
            : isMultiple
            ? 'Add File +'
            : 'Change File'}
        </Button>
        <div className="file-icon">
          <IconFileFilled />
        </div>
      </Box>

      <div
        className="file-drop-area"
        onDrop={handleDrop}
      >
        {selectedFiles.length === 0 ? (
          <Typography className="file-drop-text">
            Or
            <br />
            Drag and drop your { isMultiple ? "Files" : "File" } here
          </Typography>
        ) : (
          <div className="file-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-icon">
                  <IconFileText />
                </div>
                <Typography variant="body2" className="file-name">
                  {file.name}
                  {upload.uploading.includes(file.name)
                    ? ' (Uploading...)'
                    : upload.uploaded.includes(file.name)
                    ? ' (Uploaded)'
                    : ''}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>
      </StyledFileInput>
      {upload.uploading.length > 0 && (
        <Box>
          <LinearProgress color="primary" />  
        </Box>
      )}
      {dragError && <Typography className="file-error" textAlign="center" color="red" paddingTop={1}>{dragError}</Typography>}
    </StyledContainer>
    </>
  );
};

export default ChooseFileField;
