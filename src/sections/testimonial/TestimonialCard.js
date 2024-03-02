import { Delete, Edit } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import ModalDialog from 'src/components/Global/ModalDialog';

const TestimonialCard = ({
  testimony,
  onEdit,
  onDelete,
  onPublish,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      sx={{ position: 'relative', mt: 3 }}
    >
      <Avatar
        src={testimony.image}
        alt={testimony.name}
        sx={{
          width: 70,
          height: 70,
          position: 'absolute',
          zIndex: 1,
          top: '-10px',
          left: 'calc(50% - 35px)',
        }}
      />
      <Card
        sx={{ borderRadius: 2.5, p: 1.5, pt: 5, textAlign: 'center' }}
        elevation={3}
      >
        <Typography variant="h6">{testimony.name}</Typography>
        <Typography
          component="p"
          variant="caption"
          padding={2}
          sx={{}}
        >
          {testimony.testimonial}
        </Typography>
        <Typography
          component="span"
          variant="caption"
          color="textSecondary"
          sx={{ display: 'block', fontStyle: 'italic' }}
        >
          {moment(testimony.createdAt).fromNow()}
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: '25px',
              fontSize: '10px',
              padding: '5px 20px',
              my: 1,
              mt: 1.5,
              mx: 1,
              borderColor: testimony.isPublic
                ? 'secondary.main'
                : '#008D41',
              // backgroundColor: "#008D41",
              color: testimony.isPublic
                ? 'secondary.main'
                : '#008D41',
              '&:hover': {
                borderColor: testimony.isPublic
                  ? 'secondary.main'
                  : '#008D41',
              },
              // shadow: "none",
            }}
            onClick={onPublish}
          >
            {testimony.isPublic ? 'Unpublish' : 'Publish'}
          </Button>
          <IconButton size="small" onClick={onEdit}>
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={handleOpen}>
            <Delete />
          </IconButton>
        </Stack>
        <ModalDialog
          title="Delete Testimony?"
          subTitle="Are you sure do you want to delete this testimony?"
          open={open}
          item={testimony.name}
          handleClose={handleClose}
          handleClickOk={() => {
            handleClose();
            onDelete();
          }}
        />
      </Card>
    </Grid>
  );
};

export default TestimonialCard;
