import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
// components
import {
  ProjectCard,
  ProjectPagination,
  ProjectsSidebar as CreateProjectSidebar,
} from '../sections/projects';

import { connect } from 'react-redux';
import {
  addProject,
  deleteProject,
  editProject,
  getAllProjects,
} from 'src/redux/actions/project';
import {
  ADD_PROJECT,
  DELETE_PROJECT,
  EDIT_PROJECT,
} from 'src/redux/actionTypes';
import DataWidget from 'src/components/widgets/DataWidget';

// ----------------------------------------------------------------------

const ProjectsPage = ({
  projects,
  error,
  getAvailableProjects,
  paginationDetails,
  deleteProject,
  addProject,
  message,
  editProject,
  loading,
}) => {
  useEffect(() => {
    if (projects.length === 0) {
      getAvailableProjects({});
    }
  }, []);

  const [openSidebar, setOpenSidebar] = useState({
    show: false,
    data: null,
  });

  const handleOpenSidebar = data => {
    setOpenSidebar({ show: true, data });
  };

  const handleCloseSidebar = () => {
    setOpenSidebar({ show: false, data: null });
  };

  //Deleting project
  const [deleting, setDeleting] = useState();
  const [deleteError, setDeleteError] = useState();
  const [deleteSuccess, setDeleteSuccess] = useState();

  useEffect(() => {
    if (error?.action === DELETE_PROJECT) {
      setDeleteError(error.message);
    }
    if (message?.action === DELETE_PROJECT) {
      setDeleteSuccess(message.success);
    }
    if (
      (message?.action === EDIT_PROJECT ||
        message?.action === ADD_PROJECT)
    ) {
      setDeleteSuccess(
        message.success,
      );
      handleCloseSidebar();
    }
    setDeleting();
  }, [message, error]);

  return (
    <>
      <Helmet>
        <title> Dashboard: Projects | MUGEMA </title>
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
            Deleting <strong>"{deleting.title}"</strong> project ...
          </Alert>
        )}
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={{ my: 1, mb: 5 }}
          justifyContent="space-between"
        >
          <Typography variant="h4">Projects</Typography>
          <CreateProjectSidebar
            openSidebar={openSidebar.show}
            onOpenSidebar={() => handleOpenSidebar(null)}
            data={openSidebar.data}
            onCloseSidebar={() => handleCloseSidebar()}
            errorApi={error}
            message={message}
            onEditSubmitted={edited => {
              editProject(openSidebar.data._id, edited);
            }}
            onSubmit={data => {
              addProject(data);
            }}
          />
        </Stack>
        <DataWidget
          title={'Projects'}
          isLoading={loading && !projects.length && !error}
          isError={
            !loading && error && !projects.length ? error : null
          }
          isEmpty={!error && !loading && !projects.length}
        >
          <Grid container spacing={3}>
            {projects.map(project => (
              <Grid key={project._id} item xs={12} sm={6} md={4}>
                <ProjectCard
                  project={project}
                  onEdit={() => {
                    handleOpenSidebar(project);
                  }}
                  isDeleting={
                    deleting?.id === project._id ||
                    openSidebar.data?._id === project._id
                  }
                  onDelete={() => {
                    setDeleting({
                      id: project._id,
                      title: project.title,
                    });
                    setDeleteSuccess();
                    setDeleteError();
                    return deleteProject(project._id);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DataWidget>

        {projects.length > 0 &&
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
          )}
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  projects: state.project.projects,
  message: state.project.message,
  paginationDetails: state.project.paginationDetails,
  error: state.project.error,
  loading: state.project.loading,
});

const mapDispatchToProps = dispatch => {
  return {
    getAvailableProjects: queries =>
      dispatch(getAllProjects(queries)),
    addProject: data => dispatch(addProject(data)),
    deleteProject: id => dispatch(deleteProject(id)),
    editProject: (slug, data) => dispatch(editProject(slug, data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsPage);
