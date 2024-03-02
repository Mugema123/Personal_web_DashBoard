import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import BlogPage from './pages/blog/BlogsPage';
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';
import ProjectsPage from './pages/ProjectsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import CreateBlog from './pages/blog/CreateBlog';
import TestimonialPage from './pages/TestimonialPage';
import ServicePage from './pages/ServicePage';
import EditBlog from './pages/blog/EditBlog';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'users', element: <UserPage /> },
        { path: 'projects', element: <ProjectsPage /> },
        { path: 'blogs', element: <BlogPage /> },
        { path: 'blogs/create', element: <CreateBlog /> },
        { path: 'blogs/edit/:slug', element: <EditBlog /> },
        { path: 'testimonials', element: <TestimonialPage /> },
        { path: 'services', element: <ServicePage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
