import { Helmet } from 'react-helmet-async';

import {
  Grid,
  Button,
  Container,
  Stack,
  Typography,
  Alert,
  Box,
} from '@mui/material';

import Iconify from '../../components/iconify';
import { BlogPostCard } from '../../sections/blog';

import { Link } from 'react-router-dom';
import { useFetcher } from 'src/api/fetcher';
import { useMemo, useState } from 'react';
import DataWidget from 'src/components/widgets/DataWidget';
import CategoriesSidebar from 'src/sections/blog/CategoriesSidebar';
import { BlogService } from 'src/api';
import AuthorSidebar from 'src/sections/blog/AuthorSidebar';

export default function BlogPage() {
  const {
    data: postData,
    isError,
    isLoading,
  } = useFetcher(`/posts/getAllPosts?all=admin`);

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useMemo(
    () => setPosts(postData?.allAvailablePosts || []),
    [postData?.allAvailablePosts],
  );

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  };

  const [openAuthorSidebar, setOpenAuthorSidebar] = useState(false);

  const handleOpenAuthorSidebar = () => {
    setOpenAuthorSidebar(true);
  };

  const handleCloseAuthorSidebar = () => {
    setOpenAuthorSidebar(false);
  };

  return (
    <>
      <Helmet>
        <title> Blogs | MUGEMA</title>
      </Helmet>

      <Container>
        {error && (
          <Alert variant="standard" severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="standard" severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Blogs
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <AuthorSidebar
            openSidebar={openAuthorSidebar}
            onOpenSidebar={handleOpenAuthorSidebar}
            onCloseSidebar={handleCloseAuthorSidebar}
          />

          <CategoriesSidebar
            openSidebar={openSidebar}
            onOpenSidebar={handleOpenSidebar}
            onCloseSidebar={handleCloseSidebar}
          />

          <Link to="create" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Blog
            </Button>
          </Link>
        </Stack>

        <DataWidget
          title={'Blogs'}
          isLoading={isLoading && !posts.length && !isError}
          isError={
            isError && !posts.length && !isLoading ? isError : null
          }
          isEmpty={!isLoading && !posts.length && !isError}
        >
          <Grid container spacing={3}>
            {posts.map((item, index) => {
              const post = {
                id: item._id,
                category: item.categoryDetails.name,
                likes: item.likes_count,
                comments: item.comments_count,
                createdAt: item.createdAt,
                image: item.postImage,
                slug: item.slug,
                title: item.title,
                isPublic: item.isPublic,
                author: item.postCreator.name,
                authorPicture: item.postCreator.picture,
              };
              return (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onDelete={async () => {
                    const res = await BlogService.deleteBlog(post.id);
                    if (res !== true) {
                      setError(res);
                      return;
                    }
                    setPosts(prev =>
                      prev.filter((postA, index) => {
                        return postA.id !== post.id;
                      }),
                    );
                  }}
                  onPublish={async () => {
                    setSuccess('');
                    setError('');
                    const res = await BlogService.publishPost(
                      post.id,
                      !post.isPublic,
                    );
                    if (res.error) {
                      setError(res.error);
                      return;
                    }
                    setSuccess(res.message);
                    setPosts(prev =>
                      prev.map((postA, index) =>
                        postA.id === post.id
                          ? { ...postA, isPublic: !post.isPublic }
                          : postA,
                      ),
                    );
                  }}
                />
              );
            })}
          </Grid>
        </DataWidget>
      </Container>
    </>
  );
}
