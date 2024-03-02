import {
  ADD_PROJECT,
  DELETE_PROJECT,
  EDIT_PROJECT,
  GET_ALL_PROJECTS,
  PROJECT_ERROR,
} from '../actionTypes';

const initProjectState = {
  error: null,
  projects: [],
  message: null,
  loading: true,
  paginationDetails: null,
};

const projectReducer = (state = initProjectState, action) => {
  switch (action.type) {
    case GET_ALL_PROJECTS:
      return {
        ...state,
        error: null,
        loading: false,
        projects: [...action.payload.projects],
        paginationDetails: action.payload.paginationDetails,
      };
    case ADD_PROJECT:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        projects: [action.payload.project, ...state.projects],
      };
    case EDIT_PROJECT:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        projects: state.projects.map(project =>
          project._id !== action.payload.project._id
            ? project
            : action.payload.project,
        ),
      };
    case DELETE_PROJECT:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        projects: state.projects.filter(
          project => project._id !== action.payload.id,
        ),
      };
    case PROJECT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default projectReducer;
