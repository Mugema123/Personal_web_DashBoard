import PropTypes from "prop-types";
// @mui
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
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
  const { title, projectImage } = project;

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
        <StyledProjectImg alt={title} src={projectImage} />
      </Box>

      <Stack spacing={1} sx={{ p: 2 }}>
        <Typography variant="subtitle">{title}</Typography>
      </Stack>
      <Box sx={{ pl: 2, mb: 3 }}>
        <Stack direction="row">
          <Button
            size="small"
            color="secondary"
            variant="outlined"
            onClick={isDeleting ? null : onEdit}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={isDeleting ? null : handleOpenModal}
          >
            Delete
          </Button>
        </Stack>
      </Box>
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
