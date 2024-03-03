import {
  ADD_SKILL,
  DELETE_SKILL,
  EDIT_SKILL,
  GET_SKILLS,
  PUBLISH_SKILL,
  SKILL_ERROR,
} from '../actionTypes';

const initSkillState = {
  error: null,
  loading: true,
  skills: [],
};

const skillReducer = (state = initSkillState, action) => {
  switch (action.type) {
    case GET_SKILLS:
      return {
        error: null,
        loading: false,
        skills: [...action.payload.skills],
      };
    case ADD_SKILL:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        skills: [
          action.payload.skill,
          ...state.skills,
        ],
      };
    case EDIT_SKILL:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        skills: state.skills.map(skill =>
          skill._id !== action.payload.skill._id
            ? skill
            : action.payload.skill,
        ),
      };
    case DELETE_SKILL:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        skills: state.skills.filter(
          skill => skill._id !== action.payload.id,
        ),
      };
    case SKILL_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default skillReducer;
