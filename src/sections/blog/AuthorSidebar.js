import { useEffect, useMemo, useState } from 'react';
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
import { connect } from 'react-redux';
import { updateAuthor } from 'src/redux/actions/auth';
import { UPDATE_AUTHOR } from 'src/redux/actionTypes';

const AuthorSidebar = ({
  author,
  updateAuthor,
  userId,
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
}) => {
  //----------------------------------------------------------------
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedIn, setLinkedIn] = useState('');

  //Error state
  const [error, setError] = useState();
  //Loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError();
    if (!title || !description) {
      setError('Both title and description are required');
      return;
    }
    setError();
    const data = {
      author: {
        title,
        description,
        facebook,
        linkedin: linkedIn,
        twitter,
      },
    };
    setLoading(true);
    updateAuthor(userId, data);
  };

  useEffect(() => {
    setLoading(false);
    if (author?.error) {
      setError(author.error.message);
      return;
    }
    if (author) {
      setTitle(author?.title);
      setDescription(author?.description);
      setFacebook(author?.facebook);
      setLinkedIn(author?.linkedin);
      setTwitter(author?.twitter);
      onCloseSidebar();
    }
  }, [author]);

  return (
    <>
      <Button
        onClick={onOpenSidebar}
        variant="outlined"
        color={
          !author?.title || !author?.description
            ? 'error'
            : 'secondary'
        }
        size="small"
      >
        Author
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
            Update Author Info
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
          <Stack spacing={2} sx={{ px: 3, pt: 3 }}>
            <TextField
              label="Title"
              color="secondary"
              value={title}
              onChange={e => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              color="secondary"
              value={description}
              multiline
              rows={5}
              onChange={e => setDescription(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Facebook Link"
              color="secondary"
              fullWidth
              value={facebook}
              onChange={e => setFacebook(e.target.value)}
            />
            <TextField
              label="Twitter Link"
              color="secondary"
              fullWidth
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
            />
            <TextField
              label="LinkedIn Link"
              color="secondary"
              fullWidth
              value={linkedIn}
              onChange={e => setLinkedIn(e.target.value)}
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
              {'Submit'}
            </Button>
          ) : (
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
            >
              <CircularProgress color="inherit" size={20} />
              &nbsp; {'Updating...'}
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

const mapStateToProps = state => ({
  author: state.auth.isAuthenticated.currentUser.author,
  userId: state.auth.isAuthenticated.currentUser._id,
});

const mapDispatchToProps = dispatch => {
  return {
    updateAuthor: (id, body) => dispatch(updateAuthor(id, body)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthorSidebar);
