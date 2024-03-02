import {
  Alert,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import DataWidget from 'src/components/widgets/DataWidget';
import {
  addMember,
  deleteMember,
  editMember,
  getAllMembers,
} from 'src/redux/actions/member';
import {
  ADD_MEMBER,
  DELETE_MEMBER,
  EDIT_MEMBER,
} from 'src/redux/actionTypes';
import AddMemberSidebar from 'src/sections/members/AddMemberSidebar';
import MemberCard from 'src/sections/members/MemberCard';

// ----------------------------------------------------------------

function groupMembersByDepartment(members) {
  const membersByCategory = {};
  members.forEach(member => {
    if (membersByCategory[member.category]) {
      membersByCategory[member.category].push(member);
    } else {
      membersByCategory[member.category] = [member];
    }
  });
  return membersByCategory;
}

// ----------------------------------------------------------------

const MembersPage = ({
  members,
  getMembers,
  error,
  deleteMember,
  addMember,
  message,
  loading,
  editMember,
}) => {
  const [currentCategory, setCurrentCategory] = useState('');

  const filtered = groupMembersByDepartment(members);

  useEffect(() => {
    if (members.length === 0) {
      getMembers();
    } else {
      setCurrentCategory(currentCategory || Object.keys(filtered)[0]);
    }
  }, [members]);

  const [openSidebar, setOpenSidebar] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setEditData(null);
    setOpenSidebar(false);
  };

  //Success message
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (
      message?.action === EDIT_MEMBER ||
      message?.action === ADD_MEMBER ||
      message?.action === DELETE_MEMBER
    ) {
      setSuccess(message.success + ` ${editData?.name || ''}`);
      handleCloseSidebar();
      setCurrentCategory(Object.keys(filtered)[0]);
    }
  }, [message]);

  return (
    <>
      <Helmet>
        <title> Team/Staff | MUGEMA Admin </title>
      </Helmet>

      <Container>
        {success && (
          <Alert variant="standard" severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={{ my: 1, mb: 5 }}
          justifyContent="space-between"
        >
          <Typography variant="h4">Staff Members</Typography>
          <AddMemberSidebar
            openSidebar={openSidebar}
            onOpenSidebar={handleOpenSidebar}
            onCloseSidebar={handleCloseSidebar}
            onSubmit={({ create, data }) => {
              if (create) {
                addMember(data);
              } else {
                editMember(editData._id, data);
              }
            }}
            data={editData}
            errorApi={error}
            message={message}
          />
        </Stack>
        <DataWidget
          title={'Members'}
          isLoading={loading && !members.length && !error}
          isError={
            !loading && error && !members.length ? error : null
          }
          isEmpty={!error && !loading && !members.length}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ flexWrap: 'wrap', alignItems: 'flex-start', mb: 4 }}
            justifyContent="flex-start"
          >
            {Object.keys(filtered).map((team, index) => (
              <Button
                key={index}
                variant="contained"
                size="small"
                sx={{
                  mb: 1,
                  px: 4,
                  backgroundColor:
                    currentCategory !== team ? '#d5d5d5' : '#008D41',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor:
                      currentCategory !== team
                        ? '#d5d5d5'
                        : '#008D41',
                  },
                }}
                // disabled={currentCategory !== team}
                onClick={() => setCurrentCategory(team)}
                // fullWidth
              >
                {team}
              </Button>
            ))}
          </Stack>
          {filtered[currentCategory] && (
            <Grid container spacing={3}>
              {filtered[currentCategory].map((member, index) => {
                return (
                  <MemberCard
                    member={member}
                    key={index}
                    onDelete={() => {
                      deleteMember(member._id);
                    }}
                    onEdit={() => {
                      setEditData(member);
                      setOpenSidebar(true);
                    }}
                  />
                );
              })}
            </Grid>
          )}
        </DataWidget>
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  members: state.member.members,
  message: state.member.message,
  error: state.member.error,
  loading: state.member.loading,
});

const mapDispatchToProps = dispatch => {
  return {
    getMembers: () => dispatch(getAllMembers()),
    addMember: data => dispatch(addMember(data)),
    deleteMember: id => dispatch(deleteMember(id)),
    editMember: (id, body) => dispatch(editMember(id, body)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MembersPage);
