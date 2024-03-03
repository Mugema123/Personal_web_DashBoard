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
  ADD_SKILL,
  EDIT_SKILL,
} from 'src/redux/actionTypes';

// ----------------------------------------------------------------------

CreateSkillSidebar.propTypes = {
  openSidebar: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
  onCloseSidebar: PropTypes.func,
};

export default function CreateSkillSidebar({
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
  onSubmit,
  data,
  errorApi,
  message,
}) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setError();
    if (!name || !image) {
      setError('All fields are required');
      return;
    }

    setError();
    setLoading(true);
    const userData = {
      name,
      image,
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
    if (message?.action === ADD_SKILL && !data) {
      setName('');
      setImage('');
    }
    if (message?.action === EDIT_SKILL) {
      setName('');
      setImage('');
    }
    if (data) {
      setName(data.name);
      setImage(data.image);
    } else {
      setName('');
      setImage('');
    }
  }, [data, message]);

  useEffect(() => {
    setError(
      errorApi?.action === ADD_SKILL ||
        errorApi?.action === EDIT_SKILL
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
        Add skill
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
            {data ? 'Update' : 'Add'} Skill
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
              label="Skill Name"
              color="secondary"
              fullWidth
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <ChooseFileImage
              selected={image}
              title="Skill Logo *"
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
