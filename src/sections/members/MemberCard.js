import { Facebook, LinkedIn, Twitter } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ModalDialog from "src/components/Global/ModalDialog";

const MemberCard = ({ member, onDelete, onEdit }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Grid item xs={12} md={4}>
      <Card>
        <CardMedia
          sx={{ height: 150 }}
          image={member.image}
          title={member.name}
        />
        <CardContent sx={{ p: 1, px: 2 }}>
          <Typography variant="h5" component="div" my={0}>
            {member.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            {member.position}
          </Typography>
          <Stack direction="row" spacing={2}>
            {member.facebookProfile && (
              <IconButton
                aria-label="delete"
                component="a"
                href={member.facebookProfile}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook />
              </IconButton>
            )}
            {member.twitterProfile && (
              <IconButton
                aria-label="delete"
                component="a"
                href={member.twitterProfile}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </IconButton>
            )}
            {member.linkedlinProfile && (
              <IconButton
                aria-label="delete"
                component="a"
                href={member.linkedlinProfile}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn />
              </IconButton>
            )}
          </Stack>
        </CardContent>
        <CardActions>
          <Button size="small" color="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={handleOpen}>
            Delete
          </Button>
        </CardActions>
      </Card>
      <ModalDialog
        title="Delete Member?"
        subTitle="Are you sure do you want to delete this member?"
        open={open}
        item={member.name}
        handleClose={handleClose}
        handleClickOk={() => {
          handleClose();
          onDelete();
        }}
      />
    </Grid>
  );
};

export default MemberCard;
