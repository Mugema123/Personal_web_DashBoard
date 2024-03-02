import API from './_api_';

//Accept publication
const acceptPublication = (id, isAccepted) => {
  return API.patch(`/api/publications/${id}`, { isAccepted });
};

//DELETE PUBLICATION
const deletePublication = id => API.delete('/api/publications/' + id);

export default {
  acceptPublication,
  deletePublication,
};
