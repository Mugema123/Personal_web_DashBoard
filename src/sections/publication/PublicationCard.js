import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  Button,
  Container,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import ModalDialog from 'src/components/Global/ModalDialog';

// ----------------------------------------------------------------------

const StyledProjectImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

PublicationCard.propTypes = {
  publication: PropTypes.object,
};

export default function PublicationCard({
  publication,
  isDeleting,
  onDelete,
  onEdit,
}) {
  const { title, link, name, cover, description, isAccepted } =
    publication;

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Card sx={{ opacity: isDeleting ? 0.3 : 1 }}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <Chip
          label={name}
          size="small"
          sx={{
            px: 0.5,
            zIndex: 9,
            top: 16,
            right: 16,
            backgroundColor: '#008D41',
            color: 'white',
            position: 'absolute',
            // textTransform: "uppercase",
          }}
        />

        <StyledProjectImg alt={title} src={cover} />
      </Box>

      <Stack spacing={1} sx={{ p: 2 }}>
        <Link
          color="inherit"
          underline="hover"
          href={isDeleting ? null : link}
          target="_blank"
          component="a"
        >
          <Typography variant="subtitle">{title}</Typography>
        </Link>

        <Typography variant="caption">{description}</Typography>
      </Stack>
      <Container sx={{ mb: 1 }}>
        <Stack direction="row">
          <Button
            size="small"
            color="secondary"
            onClick={isDeleting ? null : onEdit}
          >
            {isAccepted ? 'Unpublish' : 'Publish'}
          </Button>
          <Button
            size="small"
            color="error"
            onClick={isDeleting ? null : handleOpenModal}
          >
            Delete
          </Button>
        </Stack>
      </Container>
      <ModalDialog
        title="Delete Publication?"
        subTitle={`Are you sure do you want to delete this publication?`}
        item={title}
        open={openModal}
        handleClose={handleCloseModal}
        handleClickOk={() => {
          handleCloseModal();
          onDelete();
        }}
      />
    </Card>
  );
}
