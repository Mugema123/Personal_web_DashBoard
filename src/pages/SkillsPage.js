import {
  Alert,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import {
  addSkill,
  deleteSkill,
  editSkill,
  getAllSkills,
  publishSkill,
} from 'src/redux/actions/skill';
import {
  ADD_SKILL,
  DELETE_SKILL,
  EDIT_SKILL,
  PUBLISH_SKILL,
} from 'src/redux/actionTypes';
import CreateSkillSidebar from 'src/sections/skills/CreateSkillSidebar';
import SkillCard from '../sections/skills/SkillCard';
import DataWidget from 'src/components/widgets/DataWidget';
import MessageAlert from 'src/components/widgets/MessageAlert';

const SkillsPage = ({
  skills,
  getSkills,
  error,
  deleteSkill,
  addSkill,
  message,
  loading,
  editSkill,
  publishSkill,
}) => {
  useEffect(() => {
    if (skills.length === 0) {
      getSkills();
    }
  }, [skills]);

  const [openSidebar, setOpenSidebar] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setEditData(null);
    setOpenSidebar(false);
  };

  const [success, setSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    setLoadingMessage('');
    setErrorMessage('');
    if (
      message?.action === EDIT_SKILL ||
      message?.action === ADD_SKILL ||
      message?.action === DELETE_SKILL
    ) {
      setSuccess(message.success + ` ${editData?.name || ''}`);
      handleCloseSidebar();
    }
    if (message?.action === PUBLISH_SKILL) {
      setSuccess(message.success);
    }
  }, [message]);

  useEffect(() => {
    if (
      error?.action === PUBLISH_SKILL ||
      error?.action === DELETE_SKILL
    ) {
      setErrorMessage(error?.message);
      setLoadingMessage('');
      setSuccess('');
    }
  }, [error]);
  return (
    <>
      <Helmet>
        <title> Skills | MUGEMA Portfolio </title>
      </Helmet>

      <Container>
        <MessageAlert
          state={{
            error: errorMessage,
            success,
            loading: loadingMessage,
          }}
        />
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={{ my: 1, mb: 5 }}
          justifyContent="space-between"
        >
          <Typography variant="h4">Skills</Typography>
          <CreateSkillSidebar
            openSidebar={openSidebar}
            onOpenSidebar={handleOpenSidebar}
            onCloseSidebar={handleCloseSidebar}
            onSubmit={({ create, data }) => {
              if (create) {
                addSkill(data);
              } else {
                editSkill(editData._id, data);
              }
            }}
            data={editData}
            errorApi={error}
            message={message}
          />
        </Stack>
        <DataWidget
          title={'Skills'}
          isLoading={loading && !skills.length && !error}
          isError={
            !loading && error && !skills.length ? error : null
          }
          isEmpty={!error && !loading && !skills.length}
        >
          <Grid container spacing={3}>
            {skills.map((skills, index) => (
              <SkillCard
                key={skills._id}
                skills={skills}
                onDelete={() => {
                  setSuccess('');
                  setErrorMessage('');
                  setLoadingMessage(
                    `Deleting skill by ${skills.name}, please wait,...`,
                  );
                  deleteSkill(skills._id);
                }}
                onEdit={() => {
                  setEditData(skills);
                  setOpenSidebar(true);
                }}
                onPublish={() => {
                  setSuccess('');
                  setErrorMessage('');
                  setLoadingMessage(
                    `${
                      skills.isPublic
                        ? 'Unpublishing from the public'
                        : 'Publishing to the public'
                    } skill by "${
                      skills.name
                    }", please wait,...`,
                  );
                  publishSkill(
                    skills._id,
                    !skills.isPublic,
                  );
                }}
              />
            ))}
          </Grid>
        </DataWidget>
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  skills: state.skill.skills,
  message: state.skill.message,
  error: state.skill.error,
  loading: state.skill.loading,
});

const mapDispatchToProps = dispatch => {
  return {
    getSkills: () => dispatch(getAllSkills()),
    addSkill: data => dispatch(addSkill(data)),
    deleteSkill: id => dispatch(deleteSkill(id)),
    editSkill: (id, body) =>
      dispatch(editSkill(id, body)),
    publishSkill: (id, isPublic) =>
      dispatch(publishSkill(id, isPublic)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillsPage);
