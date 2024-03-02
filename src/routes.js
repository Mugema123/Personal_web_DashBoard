import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/blog/BlogsPage';
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';
import ProjectsPage from './pages/ProjectsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import CreateBlog from './pages/blog/CreateBlog';
import TestimonialPage from './pages/TestimonialPage';
import ServicePage from './pages/ServicePage';
import MembersPage from './pages/MembersPage';
import ApplicationPage from './pages/application/ApplicationPage';
import ApplicationDetails from './pages/application/ApplicationDetails';
import EditBlog from './pages/blog/EditBlog';
import MembershipPayments from './pages/application/MembershipPayments';
import PublicationsPage from './pages/PublicationsPage';
import PaymentsReport from './pages/PaymentsReport';
import CertificationPage from './pages/CertificationPage';

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
        { path: 'application', element: <ApplicationPage /> },
        { path: 'application/:id', element: <ApplicationDetails /> },
        {
          path: 'application/:id/payments',
          element: <MembershipPayments />,
        },
        { path: 'certification', element: <CertificationPage /> },
        { path: 'projects', element: <ProjectsPage /> },
        { path: 'blogs', element: <BlogPage /> },
        { path: 'blogs/create', element: <CreateBlog /> },
        { path: 'blogs/edit/:slug', element: <EditBlog /> },
        { path: 'testimonials', element: <TestimonialPage /> },
        { path: 'services', element: <ServicePage /> },
        { path: 'staff', element: <MembersPage /> },
        { path: 'publications', element: <PublicationsPage /> },
        { path: 'reports', element: <PaymentsReport /> },
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
