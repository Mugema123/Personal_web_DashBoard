import {
  ADD_MEMBER,
  DELETE_MEMBER,
  EDIT_MEMBER,
  GET_MEMBERS,
  MEMBER_ERROR,
} from '../actionTypes';

const initMemberState = {
  error: null,
  loading: true,
  members: [],
};

const staffMemberReducer = (state = initMemberState, action) => {
  switch (action.type) {
    case GET_MEMBERS:
      return {
        error: null,
        loading: false,
        members: [...action.payload.members],
      };
    case ADD_MEMBER:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        members: [action.payload.member, ...state.members],
      };
    case EDIT_MEMBER:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        members: state.members.map(member =>
          member._id !== action.payload.member._id
            ? member
            : action.payload.member,
        ),
      };
    case DELETE_MEMBER:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        members: state.members.filter(
          member => member._id !== action.payload.id,
        ),
      };
    case MEMBER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default staffMemberReducer;
