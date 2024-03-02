import API from "./_api_";

//Create a new service
const createService = (data) => API.post("/services/addService", data);

//Getting all services
const getServices = () => {
  return API.get(`/services/getAllServices`);
};

//EDIT SERVICE
const editService = (id, body) =>
  API.put("/services/updateService?serviceId=" + id, body);

//DELETE SERVICE
const deleteService = (id) =>
  API.delete("/services/deleteService?serviceId=" + id);

export default { createService, getServices, deleteService, editService };
