import { combineReducers } from 'redux';
import authReducer from './auth';
import staffMemberReducer from './member';
import projectReducer from './project';
import serviceReducer from './service';
import skillReducer from './skills';
import userReducer from './user';
import paymentReducer from './payment';

export default combineReducers({
  project: projectReducer,
  service: serviceReducer,
  member: staffMemberReducer,
  skill: skillReducer,
  user: userReducer,
  auth: authReducer,
  payment: paymentReducer,
});
