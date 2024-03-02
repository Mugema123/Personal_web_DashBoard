import { useRoutes } from 'react-router-dom';
import HomePage from './pages/noAuth/HomePage';
import Page404 from './pages/Page404';

// ----------------------------------------------------------------------

const NoAuthRouter = () => {
  const routes = useRoutes([
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ]);

  return routes;
};

export default NoAuthRouter;
