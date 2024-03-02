import API from "./_api_";

//CREATING PROJECTS
const createProject = (data) => API.post("/projects/createProject", data);

//GET ALL PROJECTS
const getProjects = ({ page }) => {
  const pageSize = 12;
  page = page || 1;

  return API.get(
    `/projects/getAllProjects?page=${page}&perPage=${pageSize}&allFields=true`
  );
};

//EDIT PROJECT
const editProject = (slug, data) =>
  API.put("/projects/updateProject?slug=" + slug, data);

//DELETE PROJECT
const deleteProject = (id) => API.delete("/projects/deleteProject/" + id);

export default { createProject, getProjects, deleteProject, editProject };
