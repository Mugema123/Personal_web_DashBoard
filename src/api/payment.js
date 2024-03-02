import API from './_api_';

//Get Application Payments
const getApplicationPayments = applicationId =>
  API.get('/payment/getApplicationPayments/' + applicationId);

//Accept or decline payment
const decideOnPayments = (paymentId, data) =>
  API.put('/payment/decideOnPayments/' + paymentId, data);

//Notify user by email that his/her membership does expired
const notifyUser = data => API.post('/payment/notify/', data);

export default {
  getApplicationPayments,
  decideOnPayments,
  notifyUser,
};
