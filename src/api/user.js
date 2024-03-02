import API from './_api_';

//Getting all registered users
const getUsers = () => {
  return API.get(`/auth`);
};

//Delete registered user
const deleteUser = id => API.delete('auth/deleteUser?userId=' + id);

//Change user role
const changeUserRole = (id, body) =>
  API.put('/auth/assignUserRole/' + id, body);

export default {
  getUsers,
  deleteUser,
  changeUserRole,
};
