import { Helmet } from 'react-helmet-async';
import { useMemo, useState } from 'react';
// @mui
import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useFetcher } from 'src/api/fetcher';
import PublicationCard from 'src/sections/publication/PublicationCard';
import { PublicationService } from 'src/api';
import DataWidget from 'src/components/widgets/DataWidget';
// ----------------------------------------------------------------------

const PublicationsPage = ({}) => {
  const {
    data: publicationData,
    isError: publicationError,
    isLoading: publicationLoading,
  } = useFetcher('/api/publications?all=admin');

  const [publications, setPublications] = useState([]);

  useMemo(() => {
    if (publicationData?.data?.length) {
      setPublications(publicationData?.data);
    }
  }, [publicationData?.data]);
  //Deleting project
  const [deleting, setDeleting] = useState();
  const [deleteError, setDeleteError] = useState();
  const [deleteSuccess, setDeleteSuccess] = useState();

  const handleEdit = async (id, title, isAccepted) => {
    try {
      setDeleting({
        action: 'accept',
        id: id,
        title: title,
      });
      setDeleteSuccess();
      setDeleteError();
      const res = await PublicationService.acceptPublication(
        id,
        !isAccepted,
      );
      setDeleteSuccess(`"${res.data?.data?.title}"
                           has 
                          ${
                            res.data?.data?.isAccepted
                              ? ' published successfully!'
                              : 'unpublished!'
                          }`);
      setPublications(prev =>
        prev.map(pub =>
          pub._id === res.data?.data?._id
            ? {
                ...pub,
                isAccepted: res.data?.data?.isAccepted,
              }
            : pub,
        ),
      );
    } catch (error) {
      setDeleteError(error?.message);
    } finally {
      setDeleting();
    }
  };

  const handleDelete = async (id, title) => {
    try {
      setDeleting({
        action: 'delete',
        id: id,
        title: title,
      });
      setDeleteSuccess();
      setDeleteError();
      const res = await PublicationService.deletePublication(id);
      setDeleteSuccess(
        'Publication "' +
          res.data?.data?.title +
          '" has deleted successfully!',
      );
      setPublications(prev => prev.filter(pub => pub._id !== id));
    } catch (error) {
      setDeleteError(error?.message);
    } finally {
      setDeleting();
    }
  };

  return (
    <>
      <Helmet>
        <title> Publications | MUGEMA Admin </title>
      </Helmet>

      <Container>
        {deleteError && (
          <Alert variant="standard" severity="error" sx={{ mt: 2 }}>
            {deleteError}
          </Alert>
        )}
        {deleteSuccess && (
          <Alert variant="standard" severity="success" sx={{ mt: 2 }}>
            {deleteSuccess}
          </Alert>
        )}
        {deleting && (
          <Alert
            variant="standard"
            severity="info"
            icon={<CircularProgress size={20} />}
            sx={{ mt: 2 }}
          >
            {deleting?.action ? 'Updating' : 'Deleting'}{' '}
            <strong>"{deleting.title}"</strong> publication ...
          </Alert>
        )}
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={{ my: 1, mb: 5 }}
          justifyContent="space-between"
        >
          <Typography variant="h4">Publications</Typography>
        </Stack>
        <DataWidget
          title="Publications"
          isLoading={
            publicationLoading &&
            !publications.length &&
            !publicationError
          }
          isError={
            publicationError &&
            !publications.length &&
            !publicationLoading
              ? publicationError
              : null
          }
          isEmpty={
            !publicationLoading &&
            !publicationError &&
            !publications.length
          }
        >
          <Grid container spacing={3}>
            {publications.map(publication => (
              <Grid key={publication._id} item xs={12} sm={6} md={4}>
                <PublicationCard
                  publication={publication}
                  onEdit={() =>
                    handleEdit(
                      publication._id,
                      publication.title,
                      publication.isAccepted,
                    )
                  }
                  isDeleting={deleting?.id === publication._id}
                  onDelete={() =>
                    handleDelete(publication._id, publication.title)
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DataWidget>

        {/* {projects.length  &&
          paginationDetails &&
          paginationDetails.totalPages > 1 && (
            <ProjectPagination
              details={paginationDetails}
              onPrev={page => {
                getAvailableProjects({ page });
              }}
              onNext={page => {
                getAvailableProjects({ page });
              }}
            />
          )} */}
      </Container>
    </>
  );
};

export default PublicationsPage;
