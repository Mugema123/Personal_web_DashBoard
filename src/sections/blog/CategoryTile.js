import React, { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
// @mui
import {
  Stack,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ModalDialog from 'src/components/Global/ModalDialog';

const CategoryTile = ({ onEdit, onDelete, isDisabled, category }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <Stack direction="row">
            <IconButton
              edge="end"
              aria-label="delete"
              size="small"
              disabled={isDisabled}
              onClick={() => onEdit(category.id)}
            >
              <Edit size="small" />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              size="small"
              disabled={isDisabled}
              onClick={handleOpenModal}
            >
              <Delete size="small" />
            </IconButton>
          </Stack>
        }
      >
        <ListItemText
          primary={category.name}
          sx={{ color: isDisabled ? '#d3d3d3' : undefined }}
        />
        <ModalDialog
          title="Delete Category?"
          subTitle={`Are you sure do you want to delete this category? `}
          hardWarning={`This will affect all associated blogs to be not visible on the website.`}
          item={category.name}
          open={openModal}
          handleClose={handleCloseModal}
          handleClickOk={() => {
            handleCloseModal();
            onDelete(category.id);
          }}
        />
      </ListItem>

      <Divider />
    </>
  );
};

export default CategoryTile;
