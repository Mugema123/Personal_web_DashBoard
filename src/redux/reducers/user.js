import {
  GET_USERS,
  DELETE_USER,
  CHANGE_ROLE,
  USER_ERROR,
} from '../actionTypes';

const initUserState = {
  error: null,
  loading: true,
  users: [],
};

const userReducer = (state = initUserState, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        error: null,
        loading: false,
        users: [...action.payload.users],
      };
    case DELETE_USER:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        users: state.users.filter(
          user => user._id !== action.payload.id,
        ),
      };
    case CHANGE_ROLE:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        users: state.users.map(user =>
          user._id !== action.payload.updatedUser._id
            ? user
            : action.payload.updatedUser,
        ),
      };
    case USER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default userReducer;
