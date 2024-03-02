import API from './_api_';

//Add a new testimony
const addTestimony = data =>
  API.post('/testimonial/addTestimonial', data);

//Getting all testimonials
const getTestimonials = () => {
  return API.get(`/testimonial/getAllTestimonials?all=admin`);
};

//EDIT TESTIMONIAL
const editTestimony = (id, body) =>
  API.patch(
    '/testimonial/updateTestimonial?testimonialId=' + id,
    body,
  );

//PUBLISH TESTIMONIAL
const publishTestimony = (id, isPublic) =>
  API.patch('/testimonial/publish/' + id, { isPublic });

//DELETE TESIMONIAL
const deleteTestimonial = id =>
  API.delete('/testimonial/deleteTestimonial?testimonialId=' + id);

export default {
  addTestimony,
  getTestimonials,
  editTestimony,
  publishTestimony,
  deleteTestimonial,
};
