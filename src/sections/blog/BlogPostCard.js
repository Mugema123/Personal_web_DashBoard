import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import {
  Link,
  Card,
  Grid,
  Avatar,
  Typography,
  CardContent,
  Box,
  Stack,
  IconButton,
  MenuItem,
  Popover,
} from '@mui/material';

import { fDate } from '../../utils/formatTime';

import SvgColor from '../../components/svg-color';
import Iconify from 'src/components/iconify/Iconify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalDialog from 'src/components/Global/ModalDialog';

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  width: '100%',
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  marginTop: theme.spacing(2),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, onDelete, onPublish }) {
  const {
    image,
    title,
    author,
    authorPicture,
    createdAt,
    category,
    comments,
    likes,
    slug,
    isPublic,
  } = post;
  const nav = useNavigate();

  const POST_INFO = [
    { label: likes + ' likes', icon: 'eva:bulb-fill' },
    {
      label: comments + ' comments',
      icon: 'eva:message-circle-fill',
    },
    { label: isPublic ? 'Public' : 'Private', icon: 'eva:eye-fill' },
    { label: category, icon: 'eva:cube-outline' },
  ];
  const handleOpenMenu = event => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const [open, setOpen] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    handleCloseMenu();
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ position: 'relative' }}>
          <StyledCardMedia>
            <SvgColor
              color="paper"
              src="/assets/icons/shape-avatar.svg"
              sx={{
                width: 80,
                height: 36,
                zIndex: 9,
                bottom: -15,
                position: 'absolute',
                color: 'background.paper',
              }}
            />
            <StyledAvatar src={authorPicture?.url} alt={author}>
              {author[0].toUpperCase()}
            </StyledAvatar>

            <StyledCover alt={title} src={image} />
          </StyledCardMedia>

          <CardContent
            sx={{
              pt: 4,
            }}
          >
            <Typography
              gutterBottom
              variant="caption"
              sx={{ color: 'text.disabled', display: 'block' }}
            >
              {fDate(createdAt)}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="start"
              spacing={2}
            >
              <StyledTitle
                color="inherit"
                variant="subtitle2"
                underline="hover"
                href={`${process.env.REACT_APP_WEB_URL}/blog/${slug}`}
                target="_blank"
                component="a"
              >
                {title}
              </StyledTitle>
              <IconButton onClick={handleOpenMenu}>
                <Iconify
                  icon="eva:more-vertical-fill"
                  sx={{ width: 14, height: 16, mr: 0.5 }}
                />
              </IconButton>
            </Stack>

            <StyledInfo>
              {POST_INFO.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml:
                      index === 0 || index === POST_INFO.length - 1
                        ? 0
                        : 1.5,
                    mt: index === POST_INFO.length - 1 ? 1 : 0,
                  }}
                >
                  <Iconify
                    icon={info.icon}
                    sx={{ width: 16, height: 16, mr: 0.5 }}
                  />
                  <Typography variant="caption">
                    {info.label}
                  </Typography>
                </Box>
              ))}
            </StyledInfo>
          </CardContent>
        </Card>
      </Grid>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          sx={{ color: 'primary.main' }}
          href={`${process.env.REACT_APP_WEB_URL}/blog/${slug}`}
          target="_blank"
          component="a"
        >
          <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} />
          Preview
        </MenuItem>
        <MenuItem
          sx={{ color: 'success.main' }}
          onClick={() => {
            handleCloseMenu();
            onPublish();
          }}
        >
          <Iconify icon={'eva:external-link-fill'} sx={{ mr: 2 }} />
          {isPublic === true ? 'Unpublish' : 'Publish'}
        </MenuItem>
        <MenuItem
          onClick={() => nav(`/dashboard/blogs/edit/${slug}`)}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={handleOpenModal}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <ModalDialog
        title="Delete Blog?"
        subTitle={`Are you sure do you want to delete this blog?`}
        item={title}
        open={openModal}
        handleClose={handleCloseModal}
        handleClickOk={() => {
          handleCloseModal();
          onDelete();
        }}
      />
    </>
  );
}
