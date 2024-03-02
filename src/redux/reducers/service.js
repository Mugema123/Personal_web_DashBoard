import {
  ADD_SERVICE,
  DELETE_SERVICE,
  EDIT_SERVICE,
  GET_SERVICES,
  SERVICE_ERROR,
} from '../actionTypes';

const initServiceState = {
  error: null,
  loading: true,
  services: [],
};

const serviceReducer = (state = initServiceState, action) => {
  switch (action.type) {
    case GET_SERVICES:
      return {
        error: null,
        loading: false,
        services: [...action.payload.services],
      };
    case ADD_SERVICE:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        services: [action.payload.service, ...state.services],
      };
    case EDIT_SERVICE:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        services: state.services.map(service =>
          service._id !== action.payload.service._id
            ? service
            : action.payload.service,
        ),
      };
    case DELETE_SERVICE:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        services: state.services.filter(
          service => service._id !== action.payload.id,
        ),
      };
    case SERVICE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default serviceReducer;
