import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { getUsers } from 'src/redux/actions/user';
import { getAllMembers } from 'src/redux/actions/member';
import { getAllProjects } from 'src/redux/actions/project';
import { getAllSkills } from 'src/redux/actions/skill';
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
  skills,
  getSkills,
  services,
  getServices,
}) => {
  useEffect(() => {
    if (users.length === 0) getUsers();
    if (members.length === 0) getMembers();
    if (projects.length === 0) getAvailableProjects({});
    if (skills.length === 0) getSkills();
    if (services.length === 0) getServices();
  }, [users, members, projects, skills, services]);
  const {
    data: postData,
    isError,
    isLoading,
  } = useFetcher(`/posts/getAllPosts`);

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
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Registered Users"
              total={users.length}
              color="primary"
              icon={'eva:people-outline'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Projects"
              total={projects.length}
              color="warning"
              icon={'eva:activity-fill'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Skills"
              total={skills.length}
              color="success"
              icon={'eva:bulb-fill'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Services"
              total={services.length}
              color="error"
              icon={'ant-design:cloud-server-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Blogs"
              total={postData?.allAvailablePosts?.length}
              color="secondary"
              icon={'ant-design:block-outlined'}
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
  skills: state.skill.skills,
  services: state.service.services,
});

const mapDispatchToProps = dispatch => {
  return {
    getUsers: () => dispatch(getUsers()),
    getMembers: () => dispatch(getAllMembers()),
    getAvailableProjects: queries =>
      dispatch(getAllProjects(queries)),
    getSkills: () => dispatch(getAllSkills()),
    getServices: () => dispatch(getAllServices()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardAppPage);
