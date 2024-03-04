import {
  Alert,
  Container,
  Divider,
  List,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import DataWidget from 'src/components/widgets/DataWidget';
import {
  addService,
  deleteService,
  editService,
  getAllServices,
} from 'src/redux/actions/service';
import {
  ADD_SERVICE,
  DELETE_SERVICE,
  EDIT_SERVICE,
} from 'src/redux/actionTypes';
import CreateServiceSidebar from 'src/sections/service/CreateServiceSidebar';
import ServiceTile from 'src/sections/service/ServiceTile';

const ServicePage = ({
  services,
  getServices,
  error,
  loading,
  deleteService,
  addService,
  message,
  editService,
}) => {
  useEffect(() => {
    getServices();
  }, []);

  const [openSidebar, setOpenSidebar] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setEditData(null);
    setOpenSidebar(false);
  };

  //Success message
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (
      message?.action === EDIT_SERVICE ||
      message?.action === ADD_SERVICE ||
      message?.action === DELETE_SERVICE
    ) {
      setSuccess(
        message.success + ` ${editData?.serviceTitle || ''}`,
      );
      handleCloseSidebar();
    }
  }, [message]);

  return (
    <>
      <Helmet>
        <title> Services | MUGEMA </title>
      </Helmet>

      <Container>
        {success && (
          <Alert variant="standard" severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={{ my: 1, mb: 5 }}
          justifyContent="space-between"
        >
          <Typography variant="h4">Services</Typography>
          <CreateServiceSidebar
            openSidebar={openSidebar}
            onOpenSidebar={handleOpenSidebar}
            onCloseSidebar={handleCloseSidebar}
            onSubmit={({ create, data }) => {
              if (create) {
                addService(data);
              } else {
                editService(editData._id, data);
              }
            }}
            data={editData}
            errorApi={error}
            message={message}
          />
        </Stack>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <DataWidget
            title={'Services'}
            isLoading={loading && !services.length && !error}
            isError={
              !loading && error && !services.length ? error : null
            }
            isEmpty={!error && !loading && !services.length}
          >
            {services.map((service, index) => {
              return (
                <div key={index}>
                  <ServiceTile
                    service={service}
                    index={index}
                    onEdit={() => {
                      setEditData(service);
                      setOpenSidebar(true);
                    }}
                    onDelete={() => deleteService(service._id)}
                  />
                  {index !== services.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </div>
              );
            })}
          </DataWidget>
        </List>
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  services: state.service.services,
  message: state.service.message,
  error: state.service.error,
  loading: state.service.loading,
});

const mapDispatchToProps = dispatch => {
  return {
    getServices: () => dispatch(getAllServices()),
    addService: data => dispatch(addService(data)),
    deleteService: id => dispatch(deleteService(id)),
    editService: (id, body) => dispatch(editService(id, body)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServicePage);
