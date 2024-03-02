import {
  Alert,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import CreateBlogForm from 'src/sections/blog/CreateBlogForm';
import { useMemo, useState } from 'react';
import { BlogService } from 'src/api';

const CreateBlog = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const nav = useNavigate();

  useMemo(() => {
    if (data) {
      async function addBlog() {
        try {
          setLoading(true);
          const result = await BlogService.createBlog(data);
          if (result.data?.successMessage) {
            nav('../blogs');
          } else {
            throw new Error('Unknown error occured');
          }
        } catch (error) {
          // console.log(error);
          setError(error.message);
        } finally {
          setLoading(false);
          setData(null);
        }
      }
   
      addBlog();
    }
  }, [data]);
  return (
    <>
      <Helmet>
        <title> Create Blog | MUGEMA Admin</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" mb={5}>
          <Link to="../blogs">
            <IconButton aria-label="delete" size="medium">
              <ArrowBack fontSize="small" />
            </IconButton>
          </Link>
          <Typography variant="h4">Create Blog</Typography>
        </Stack>
        {error && (
          <Alert variant="standard" severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <CreateBlogForm
          loading={loading}
          onCreate={data => {
            setError(null);
            return setData(data);
          }}
        />
      </Container>
    </>
  );
};

export default CreateBlog;
