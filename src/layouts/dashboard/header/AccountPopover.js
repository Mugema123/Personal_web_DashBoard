import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
} from '@mui/material';
// mocks_
// import account from '../../../_mock/account';
import { connect } from 'react-redux';
import { logOut } from 'src/redux/actions/auth';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Go to Website',
    icon: 'eva:home-fill',
  },
  // {
  //   label: 'Profile',
  //   icon: 'eva:person-fill',
  // },
];

// ----------------------------------------------------------------------

const AccountPopover = ({ user, logout }) => {
  const [open, setOpen] = useState(null);
  const { picture, email, name } = user;

  const handleOpen = event => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const nav = useNavigate();

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: theme => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={picture?.url} alt={name}>
          {name?.charAt(0)}
        </Avatar>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}
            noWrap
          >
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map(option => (
            <MenuItem
              href={process.env.REACT_APP_WEB_URL}
              target="_blank"
              component="a"
              key={option.label}
              onClick={() => handleClose()}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleClose();
            logout(nav);
          }}
          sx={{ m: 1 }}
        >
          Sign Out
        </MenuItem>
      </Popover>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.auth.isAuthenticated.currentUser,
});

const mapDispatchToProps = dispatch => {
  return {
    logout: nav => dispatch(logOut(nav)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountPopover);
