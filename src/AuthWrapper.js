import Router from './routes';
import ScrollToTop from './components/scroll-to-top';
import NoAuthRouter from './noauth.routes';
import { connect } from 'react-redux';
import { getLoggedInUser } from './redux/actions/auth';
import { useEffect, useMemo } from 'react';

const AuthWrapper = ({ auth, getUser }) => {
  const { loading, error, isAuthenticated } = auth;

  useEffect(() => {
    if (!isAuthenticated?.currentUser) {
      getUser();
    }
  }, [isAuthenticated?.currentUser]);

  if (
    loading === false &&
    error === null &&
    isAuthenticated?.status === true &&
    isAuthenticated?.currentUser
  ) {
    return (
      <>
        <ScrollToTop />
        <Router />
      </>
    );
  }
  return <NoAuthRouter />;
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => {
  return {
    getUser: () => dispatch(getLoggedInUser()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthWrapper);
