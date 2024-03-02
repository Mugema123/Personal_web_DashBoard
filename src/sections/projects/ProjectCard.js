import PropTypes from "prop-types";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import ModalDialog from "src/components/Global/ModalDialog";

// ----------------------------------------------------------------------

const StyledProjectImg = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

// ----------------------------------------------------------------------

ProjectCard.propTypes = {
  project: PropTypes.object,
};

export default function ProjectCard({ project, isDeleting, onDelete, onEdit }) {
  const { title, projectImage, location, category } = project;

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Card sx={{ opacity: isDeleting ? 0.3 : 1 }}>
      <Box sx={{ pt: "100%", position: "relative" }}>
        <Chip
          label={category}
          size="small"
          sx={{
            px: 0.5,
            zIndex: 9,
            top: 16,
            right: 16,
            backgroundColor: "#008D41",
            color: "white",
            position: "absolute",
            // textTransform: "uppercase",
          }}
        />

        <StyledProjectImg alt={title} src={projectImage} />
      </Box>

      <Stack spacing={1} sx={{ p: 2 }}>
        <Link
          color="inherit"
          underline="hover"
          href={
            isDeleting
              ? null
              : `${process.env.REACT_APP_WEB_URL}/projects/${project.slug}`
          }
          target="_blank"
          component="a"
        >
          <Typography variant="subtitle">{title}</Typography>
        </Link>
        <Typography variant="caption">{location}</Typography>
      </Stack>
      <Container sx={{ mb: 1 }}>
        <Stack direction="row">
          <Button
            size="small"
            color="secondary"
            onClick={isDeleting ? null : onEdit}
          >
            Edit
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
        title="Delete Project?"
        subTitle={`Are you sure do you want to delete this project?`}
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
