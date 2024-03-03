import API from './_api_';

//Add a new testimony
const addSkills = data =>
  API.post('/skills/addSkill', data);

//Getting all testimonials
const getSkills = () => {
  return API.get(`/skills/getAllSkills?all=admin`);
};

//EDIT TESTIMONIAL
const editSkills = (id, body) =>
  API.patch(
    '/skills/updateSkill?skillId=' + id,
    body,
  );

//PUBLISH TESTIMONIAL
const publishSkills = (id, isPublic) =>
  API.patch('/skills/publish/' + id, { isPublic });

//DELETE TESIMONIAL
const deleteSkill = id =>
  API.delete('/skills/deleteSkill?skillId=' + id);

export default {
  addSkills,
  getSkills,
  editSkills,
  publishSkills,
  deleteSkill,
};
