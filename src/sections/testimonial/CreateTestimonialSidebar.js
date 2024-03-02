import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import ChooseFileImage from 'src/components/Global/files/ChooseFileImage';
import {
  ADD_TESTIMONIAL,
  EDIT_TESTIMONIAL,
} from 'src/redux/actionTypes';

// ----------------------------------------------------------------------

CreateTestimonialSidebar.propTypes = {
  openSidebar: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
  onCloseSidebar: PropTypes.func,
};

export default function CreateTestimonialSidebar({
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
  onSubmit,
  data,
  errorApi,
  message,
}) {
  const [name, setName] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [image, setImage] = useState('');

  //Error state
  const [error, setError] = useState();
  //Loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setError();
    if (!name || !image || !testimonial) {
      setError('All fields are required');
      return;
    }

    setError();
    setLoading(true);
    const userData = {
      name,
      image,
      testimonial,
    };
    if (!data) {
      onSubmit({
        create: true,
        data: { ...userData, upload: 'new' },
      });
    } else {
      onSubmit({
        create: false,
        data: userData,
      });
    }
  };

  useEffect(() => {
    setLoading(false);
    if (message?.action === ADD_TESTIMONIAL && !data) {
      setName('');
      setTestimonial('');
      setImage('');
    }
    if (message?.action === EDIT_TESTIMONIAL) {
      setName('');
      setTestimonial('');
      setImage('');
    }
    if (data) {
      setName(data.name);
      setTestimonial(data.testimonial);
      setImage(data.image);
    } else {
      setName('');
      setTestimonial('');
      setImage('');
    }
  }, [data, message]);

  useEffect(() => {
    setError(
      errorApi?.action === ADD_TESTIMONIAL ||
        errorApi?.action === EDIT_TESTIMONIAL
        ? errorApi?.message
        : '',
    );
    setLoading(false);
  }, [errorApi]);
  return (
    <>
      <Button
        onClick={onOpenSidebar}
        variant="outlined"
        color="secondary"
        startIcon={<AddCircleOutlineOutlined />}
      >
        Add testimonial
      </Button>

      <Drawer
        anchor="right"
        open={openSidebar}
        onClose={onCloseSidebar}
        PaperProps={{
          sx: { width: 320, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            {data ? 'Update' : 'Add'} Testimonial
          </Typography>
          <IconButton onClick={onCloseSidebar}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>
        {error && (
          <Alert variant="standard" severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <TextField
              label="Full Name"
              color="secondary"
              fullWidth
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <TextField
              label="Testimonial"
              color="secondary"
              fullWidth
              required
              multiline
              rows={5}
              value={testimonial}
              onChange={e => setTestimonial(e.target.value)}
            />
            <ChooseFileImage
              selected={image}
              title="User image *"
              onSelect={selected => setImage(selected)}
            />
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          {!loading ? (
            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              onClick={handleSubmit}
              variant="outlined"
            >
              {data ? 'Update' : 'Submit'}
            </Button>
          ) : (
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
            >
              <CircularProgress color="inherit" size={20} />
              &nbsp; {data ? 'Updating' : 'Creating'}
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
}
