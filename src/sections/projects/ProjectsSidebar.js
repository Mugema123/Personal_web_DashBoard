import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import Iconify from '../../components/iconify';
import { useEffect, useState } from 'react';
import { ADD_PROJECT, EDIT_PROJECT } from 'src/redux/actionTypes';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import ChooseFileImage from 'src/components/Global/files/ChooseFileImage';

CreateProjectSidebar.propTypes = {
  openSidebar: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
  onCloseSidebar: PropTypes.func,
};

export default function CreateProjectSidebar({
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
  onSubmit,
  errorApi,
  message,
  data,
  onEditSubmitted,
}) {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectImage, setProjectImage] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setError();
    if (!projectName || !projectImage || !githubLink || !demoLink) {
      setError('All fields are required please');
      return;
    }
    setError();
    setLoading(true);
    if (!data) {
      onSubmit({
        title: projectName,
        description: projectDescription,
        projectImage: projectImage,
        githubLink: githubLink,
        demoLink: demoLink,
      });
    } else {
      const editedData = {
        title: projectName,
        description: projectDescription,
        projectImage: projectImage,
        githubLink: githubLink,
        demoLink: demoLink,
      };
      onEditSubmitted(editedData);
    }
  };

  useEffect(() => {
    setLoading(false);
    if (message?.action === ADD_PROJECT && !data) {
      setProjectName('');
      setProjectDescription('');
      setProjectImage('');
      setGithubLink('');
      setDemoLink('');
    }
    if (message?.action === EDIT_PROJECT) {
      setProjectName('');
      setProjectDescription('');
      setProjectImage('');
      setGithubLink('');
      setDemoLink('');
    }
    if (data) {
      setProjectName(data.title);
      setProjectDescription(data.description);
      setProjectImage(data.projectImage);
      setGithubLink(data.githubLink);
      setDemoLink(data.demoLink);
    } else {
      setProjectName('');
      setProjectDescription('');
      setProjectImage('');
      setGithubLink('');
      setDemoLink('');
    }
  }, [message, data]);

  useEffect(() => {
    setError(
      errorApi?.action === ADD_PROJECT ||
        errorApi?.action === EDIT_PROJECT
        ? errorApi?.message
        : '',
    );
    setLoading(false);
  }, [errorApi]);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => onOpenSidebar()}
      >
        New Project
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
            {data ? 'Edit' : 'Create'} Project
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
              label="Project Name"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Project Description"
              value={projectDescription}
              onChange={e => setProjectDescription(e.target.value)}
              fullWidth
              multiline
              rows={7}
              required
            />
            <ChooseFileImage 
              title="Project Image"
              onSelect={setProjectImage}
              selected={projectImage}
              error={error}
            />
            <TextField
              label="Github Link"
              value={githubLink}
              onChange={e => setGithubLink(e.target.value)}
              fullWidth
            />
            <TextField
              label="Demo Link"
              value={demoLink}
              onChange={e => setDemoLink(e.target.value)}
              fullWidth
            />
            {!loading ? (
              <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                onClick={handleSubmit}
                variant="outlined"
              >
                {data ? 'Update' : 'Submit'} Project
              </Button>
            ) : (
              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
              >
                <CircularProgress color="inherit" size={20} />
                &nbsp; {data ? 'Updating' : 'Creating'} Project
              </Button>
            )}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
