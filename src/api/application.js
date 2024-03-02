import API from './_api_';

//Getting all applications
const getApplications = () => {
  return API.get(`/api/applications`);
};

//Edit individual application membership
const editApplicationMembership = (id, membership) =>
  API.patch(`/api/applications/membership/${id}`, { membership });

//DELETE APPLICATION
const deleteApplication = id => API.delete('/api/applications/' + id);

export default {
  getApplications,
  editApplicationMembership,
  deleteApplication,
};
