import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { getUsers } from 'src/redux/actions/user';
import { getAllMembers } from 'src/redux/actions/member';
import { getAllProjects } from 'src/redux/actions/project';
import { getAllTestimonials } from 'src/redux/actions/testimonial';
import { getAllServices } from 'src/redux/actions/service';

import { AppWidgetSummary } from '../sections/app';
import { useFetcher } from 'src/api/fetcher';

const DashboardAppPage = ({
  users,
  getUsers,
  members,
  getMembers,
  projects,
  getAvailableProjects,
  testimonials,
  getTestimonials,
  services,
  getServices,
}) => {
  useEffect(() => {
    if (users.length === 0) getUsers();
    if (members.length === 0) getMembers();
    if (projects.length === 0) getAvailableProjects({});
    if (testimonials.length === 0) getTestimonials();
    if (services.length === 0) getServices();
  }, [users, members, projects, testimonials, services]);
  const {
    data: postData,
    isError,
    isLoading,
  } = useFetcher(`/posts/getAllPosts`);

  const {
    data: applicationData,
    isError: applicationError,
    isLoading: applicationLoading,
  } = useFetcher(`/api/applications`);
  const {
    data: publicationData,
    isError: publicationError,
    isLoading: publicationLoading,
  } = useFetcher('/api/publications?all=admin');

  const { junior, professional, consulting, company } =
    useMemo(() => {
      if (applicationData?.data?.length) {
        return {
          junior: applicationData?.data?.filter(
            app => app.membership === 'Junior',
          ).length,
          professional: applicationData?.data?.filter(
            app => app.membership === 'Professional',
          ).length,
          consulting: applicationData?.data?.filter(
            app => app.membership === 'Consulting',
          ).length,
          company: applicationData?.data?.filter(
            app => app.membership === 'Company',
          ).length,
        };
      }
      return {};
    }, [applicationData?.data]);
  return (
    <>
      <Helmet>
        <title> Dashboard | MUGEMA </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome to the Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Members"
              total={applicationData?.pagination?.count}
              color="info"
              icon={'eva:people-fill'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Junior Members"
              total={junior || 0}
              color="warning" 
              icon={'eva:people-fill'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Professional Members"
              total={professional || 0}
              color="success"
              icon={'eva:people-fill'}
              me
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Consulting Members"
              total={consulting || 0}
              color="error"
              icon={'eva:people-fill'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Company Members"
              total={company || 0}
              color="primary"
              icon={'eva:people-fill'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Registered Users"
              total={users.length}
              color="secondary"
              icon={'eva:people-outline'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Staff Members"
              total={members.length}
              color="info"
              icon={'eva:book-open-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Projects"
              total={projects.length}
              color="warning"
              icon={'eva:activity-fill'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Testimonials"
              total={testimonials.length}
              color="success"
              icon={'eva:bulb-fill'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Services"
              total={services.length}
              color="error"
              icon={'ant-design:cloud-server-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Blogs"
              total={postData?.allAvailablePosts?.length}
              color="primary"
              icon={'ant-design:block-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Publications"
              total={publicationData?.data?.length}
              color="secondary"
              icon={'ant-design:delivered-procedure-outlined'}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  users: state.user.users,
  members: state.member.members,
  projects: state.project.projects,
  testimonials: state.testimonial.testimonials,
  services: state.service.services,
});

const mapDispatchToProps = dispatch => {
  return {
    getUsers: () => dispatch(getUsers()),
    getMembers: () => dispatch(getAllMembers()),
    getAvailableProjects: queries =>
      dispatch(getAllProjects(queries)),
    getTestimonials: () => dispatch(getAllTestimonials()),
    getServices: () => dispatch(getAllServices()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardAppPage);
