import API from './_api_';

//Login new user
const logIn = data => API.post('/auth/loginAdmin', data);
const logInWithGoogle = data =>
  API.post('/auth/loginAdmin?withGoogle=true', data);
//Getting logged in user info
const loggedInUser = () => {
  return API.get(`/auth/loggedInUser`);
};
//Logout the current user
const logoutUser = () => {
  return API.post(`/auth/logoutUser`);
};
//Update author info
const updateAuthorInfo = (userId, body) => {
  return API.put('/auth/updateAuthorInfo/' + userId, body);
};

export default {
  logIn,
  loggedInUser,
  logInWithGoogle,
  logoutUser,
  updateAuthorInfo,
};
