import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from '@mui/material';
import { connect } from 'react-redux';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------
const Page404 = ({ auth }) => {
  const { loading } = auth;
  if (loading === null || loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress sx={{ color: '#0891B2' }} />
      </Container>
    );
  }
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found | MUGEMA Portfolio</title>
      </Helmet>

      <Container>
        <StyledContent
          sx={{ textAlign: 'center', alignItems: 'center' }}
        >
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>
          <Box
            component="img"
            src="/assets/illustrations/illustration_404.svg"
            sx={{ height: 160, mx: 'auto', my: 2 }}
          />

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for.
            Perhaps you’ve mistyped the URL? Be sure to check your
            spelling.
          </Typography>

          <Button
            to="/"
            size="medium"
            variant="contained"
            component={RouterLink}
            sx={{
              backgroundColor: '#0891B2',
              '&:hover': { backgroundColor: '#0891B2' },
              mt: 2,
            }}
          >
            Go to Home
          </Button>
        </StyledContent>
      </Container>
    </>
  );
};
const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Page404);
