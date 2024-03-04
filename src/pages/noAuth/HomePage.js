import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { signInAdmin } from 'src/redux/actions/auth';
import { LOADING } from 'src/redux/actionTypes';
import {
  GoogleOAuthProvider,
  GoogleLogin,
} from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/api';
import { toast } from 'react-hot-toast';
import MessageAlert from 'src/components/widgets/MessageAlert';
import Logo from 'src/components/logo/Logo';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const initFormData = {
  email: '',
  password: '',
};

const initState = { loading: false, error: null };

const HomePage = ({ auth, login }) => {
  const { loading, error, isAuthenticated } = auth;
  const [formData, setFormData] = useState(initFormData);
  const [state, setState] = useState(initState);
  const searchParams = new URLSearchParams(document.location.search);

  const handleSubmit = async e => {
    e.preventDefault();
    if (state.loading) return;
    setState(initState);
    try {
      const result = await toast.promise(
        AuthService.logIn(formData),
        {
          loading: `Signing in, please wait...`,
          success: `Logged in successfully!`,
          error: error => {
            if (error.response) {
              return (
                error.response?.data?.message ||
                error.response?.data?.invalidEmail ||
                error.message ||
                'Unknown error occured, please try again.'
              );
            } else {
              return 'Something went wrong while logging in, please try again';
            }
          },
        },
      );
      if (result?.data) {
        localStorage.setItem('loggedInUser', JSON.stringify(result?.data));
        login(result?.data?.result);
        return;
      }
      throw new Error(
        'Login went successfully but data being returned is unprecised',
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error.response?.data?.message ||
          error.response?.data?.invalidEmail ||
          error.message ||
          'Unknown error occured, please try again.',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const googleSuccess = async response => {
    const resultA = jwt_decode(response.credential);
    if (state.loading) return;
    setState(initState);
    try {
      const result = await toast.promise(
        AuthService.logInWithGoogle({ email: resultA.email }),
        {
          loading: `Signing in, please wait...`,
          success: `Logged in successfully!`,
          error: error => {
            if (error.response) {
              return (
                error.response?.data?.message ||
                error.response?.data?.invalidEmail ||
                error.message ||
                'Unknown error occured, please try again.'
              );
            } else {
              return 'Something went wrong while logging in, please try again';
            }
          },
        },
      );
      if (result?.data) {
        localStorage.setItem('loggedInUser', JSON.stringify(result?.data));
        login(result?.data?.result);
        return;
      }
      throw new Error(
        'Login went successfully but data being returned is unprecised',
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error.response?.data?.message ||
          error.response?.data?.invalidEmail ||
          error.message ||
          'Unknown error occured, please try again.',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const googleFailure = error => {
    console.log(error);
  };

  const onChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {loading && <CircularProgress sx={{ color: '#0891B2' }} />}
      {error && (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack
            justifyContent="center"
            alignItems="center"
            direction="column"
            spacing={2}
            sx={{
              margin: '0px auto',
              backgroundColor: '#ffffff',
              border: '1px solid #d2d2d2',
              borderRadius: 1,
              padding: 4,
              width: {
                xs: '100%',
                lg: '35%',
              },
            }}
          >
            <Logo />
            <Typography gutterBottom variant="h5" textAlign="center">
              Admin Dashboard
            </Typography>
            {/* <MessageAlert
              state={{
                ...state,
              }}
            /> */}
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={googleSuccess}
                onError={googleFailure}
                useOneTap
                width={300}
                cookiePolicy="single_host_origin"
              />
            </GoogleOAuthProvider>
            <Grid
              container
              direction="column"
              justifyContent="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Divider
                    sx={{ flexGrow: 1 }}
                    orientation="horizontal"
                  />

                  <Button
                    variant="outlined"
                    sx={{
                      cursor: 'unset',
                      mx: 2,
                      py: 0.5,
                      px: 7,
                      fontWeight: 500,
                      borderRadius: `7px`,
                    }}
                    disableRipple
                    disabled
                  >
                    OR
                  </Button>

                  <Divider
                    sx={{ flexGrow: 1, color: 'red' }}
                    orientation="horizontal"
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="center"
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    Sign in with Email address
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <TextField
              type="email"
              label="Email"
              fullWidth
              value={formData.email}
              name="email"
              required
              onChange={onChange}
            />
            <FormControl required fullWidth>
              <InputLabel htmlFor="outlined-adornment-password-login">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                name="password"
                label="Password"
                required
                fullWidth
                onChange={onChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
            </FormControl>

            <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#0891B2',
                '&:hover': { backgroundColor: '#0891B2' },
                mt: 2,
              }}
            >
              Login
            </Button>
          </Stack>
        </form>
      )}
    </Container>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => {
  return {
    login: credentials => dispatch(signInAdmin(credentials)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
