import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CreateBlogForm from 'src/sections/blog/CreateBlogForm';
import { useMemo, useState } from 'react';
import { BlogService } from 'src/api';
import MessageAlert from 'src/components/widgets/MessageAlert';
import { connect } from 'react-redux';

const EditBlog = ({ userId }) => {
  const nav = useNavigate();
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [showNotCreator, setShowNotCreator] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useMemo(() => {
    if (slug) {
      async function getPost() {
        try {
          setLoading(true);
          const result = await BlogService.getSinglePost(slug);
          setData(result.data?.fetchedPost);
          setShowNotCreator(
            result.data?.fetchedPost?.postCreator?._id !== userId,
          );
        } catch (error) {
          setError(
            error.response?.data?.message ||
              error.message ||
              'Unknown error has occured',
          );
        } finally {
          setLoading(false);
        }
      }
      getPost();
    }
  }, [slug]);

  useMemo(() => {
    if (submittedData) {
      async function editPost() {
        try {
          setEditLoading(true);
          const result = await BlogService.updatePost(
            slug,
            submittedData,
          );
          if (result.data?.postUpdateSuccess) nav('../blogs');
        } catch (error) {
          // console.log(error)
          setError(
            error.response?.data?.message ||
              error.response?.data?.invalidToken ||
              error.response?.data?.postUpdateError ||
              error.response?.data?.unauthorizedError ||
              error.message ||
              'Unknown error has occured',
          );
        } finally {
          setEditLoading(false);
        }
      }
      editPost();
    }
  }, [submittedData]);

  // console.log(data);

  return (
    <>
      <Helmet>
        <title> Edit Blog | MUGEMA Admin</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" mb={4}>
          <Link to="../blogs">
            <IconButton aria-label="delete" size="medium">
              <ArrowBack fontSize="small" />
            </IconButton>
          </Link>
          <Typography variant="h4">Edit Blog</Typography>
        </Stack>
        {showNotCreator && (
          <Alert
            sx={{ my: 2 }}
            severity="error"
            variant="filled"
            action={
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                sx={{ borderColor: '#d2d2d2' }}
                onClick={() => setShowNotCreator(false)}
              >
                I UNDERSTAND
              </Button>
            }
          >
            <AlertTitle>You're not creator of this post</AlertTitle>
            Any change you can make on this post will have no effect
          </Alert>
        )}
        <MessageAlert
          state={{
            error,
            loading:
              loading && !data
                ? 'Loading post, please wait...'
                : null,
          }}
        />

        {data && !loading && (
          <CreateBlogForm
            data={data}
            loading={editLoading}
            onCreate={data => {
              setError(null);
              setSubmittedData(data);
            }}
          />
        )}
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  userId: state.auth.isAuthenticated.currentUser._id,
});

export default connect(mapStateToProps)(EditBlog);
