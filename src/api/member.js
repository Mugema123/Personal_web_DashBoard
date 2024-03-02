import API from './_api_';

//Create a new staff member
const createMember = data => API.post('/staff/addMember', data);

//Getting all staff members
const getMembers = () => {
  return API.get(`/staff/getAllMembers`);
};

//EDIT STAFF MEMBER
const editMember = (id, body) =>
  API.patch('/staff/updateMember?memberId=' + id, body);

//DELETE STAFF MEMBER
const deleteMember = id =>
  API.delete('/staff/deleteMember?memberId=' + id);

export default { createMember, getMembers, deleteMember, editMember };
