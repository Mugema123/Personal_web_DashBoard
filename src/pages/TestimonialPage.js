import {
  Alert,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import {
  addTestimonial,
  deleteTestimonial,
  editTestimonial,
  getAllTestimonials,
  publishTestimonial,
} from 'src/redux/actions/testimonial';
import {
  ADD_TESTIMONIAL,
  DELETE_TESTIMONIAL,
  EDIT_TESTIMONIAL,
  PUBLISH_TESTIMONIAL,
} from 'src/redux/actionTypes';
import CreateTestimonialSidebar from 'src/sections/testimonial/CreateTestimonialSidebar';
import TestimonialCard from '../sections/testimonial/TestimonialCard';
import DataWidget from 'src/components/widgets/DataWidget';
import MessageAlert from 'src/components/widgets/MessageAlert';

const TestimonialPage = ({
  testimonials,
  getTestimonials,
  error,
  deleteTestimonial,
  addTestimonial,
  message,
  loading,
  editTestimonial,
  publishTestimonial,
}) => {
  useEffect(() => {
    if (testimonials.length === 0) {
      getTestimonials();
    }
  }, [testimonials]);

  const [openSidebar, setOpenSidebar] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setEditData(null);
    setOpenSidebar(false);
  };

  const [success, setSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    setLoadingMessage('');
    setErrorMessage('');
    if (
      message?.action === EDIT_TESTIMONIAL ||
      message?.action === ADD_TESTIMONIAL ||
      message?.action === DELETE_TESTIMONIAL
    ) {
      setSuccess(message.success + ` ${editData?.name || ''}`);
      handleCloseSidebar();
    }
    if (message?.action === PUBLISH_TESTIMONIAL) {
      setSuccess(message.success);
    }
  }, [message]);

  useEffect(() => {
    if (
      error?.action === PUBLISH_TESTIMONIAL ||
      error?.action === DELETE_TESTIMONIAL
    ) {
      setErrorMessage(error?.message);
      setLoadingMessage('');
      setSuccess('');
    }
  }, [error]);
  return (
    <>
      <Helmet>
        <title> Testimonials | MUGEMA Portfolio </title>
      </Helmet>

      <Container>
        <MessageAlert
          state={{
            error: errorMessage,
            success,
            loading: loadingMessage,
          }}
        />
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={{ my: 1, mb: 5 }}
          justifyContent="space-between"
        >
          <Typography variant="h4">Testimonials</Typography>
          <CreateTestimonialSidebar
            openSidebar={openSidebar}
            onOpenSidebar={handleOpenSidebar}
            onCloseSidebar={handleCloseSidebar}
            onSubmit={({ create, data }) => {
              if (create) {
                addTestimonial(data);
              } else {
                editTestimonial(editData._id, data);
              }
            }}
            data={editData}
            errorApi={error}
            message={message}
          />
        </Stack>
        <DataWidget
          title={'Testimonials'}
          isLoading={loading && !testimonials.length && !error}
          isError={
            !loading && error && !testimonials.length ? error : null
          }
          isEmpty={!error && !loading && !testimonials.length}
        >
          <Grid container spacing={3}>
            {testimonials.map((testimony, index) => (
              <TestimonialCard
                key={testimony._id}
                testimony={testimony}
                onDelete={() => {
                  setSuccess('');
                  setErrorMessage('');
                  setLoadingMessage(
                    `Deleting testimonial by ${testimony.name}, please wait,...`,
                  );
                  deleteTestimonial(testimony._id);
                }}
                onEdit={() => {
                  setEditData(testimony);
                  setOpenSidebar(true);
                }}
                onPublish={() => {
                  setSuccess('');
                  setErrorMessage('');
                  setLoadingMessage(
                    `${
                      testimony.isPublic
                        ? 'Unpublishing from the public'
                        : 'Publishing to the public'
                    } testimonial by "${
                      testimony.name
                    }", please wait,...`,
                  );
                  publishTestimonial(
                    testimony._id,
                    !testimony.isPublic,
                  );
                }}
              />
            ))}
          </Grid>
        </DataWidget>
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  testimonials: state.testimonial.testimonials,
  message: state.testimonial.message,
  error: state.testimonial.error,
  loading: state.testimonial.loading,
});

const mapDispatchToProps = dispatch => {
  return {
    getTestimonials: () => dispatch(getAllTestimonials()),
    addTestimonial: data => dispatch(addTestimonial(data)),
    deleteTestimonial: id => dispatch(deleteTestimonial(id)),
    editTestimonial: (id, body) =>
      dispatch(editTestimonial(id, body)),
    publishTestimonial: (id, isPublic) =>
      dispatch(publishTestimonial(id, isPublic)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestimonialPage);
