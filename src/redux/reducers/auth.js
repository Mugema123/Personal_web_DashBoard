import {
  AUTHENTICATED,
  LOADING,
  AUTH_ERROR,
  LOGOUT,
  UPDATE_AUTHOR,
} from '../actionTypes';

/**
 * @param {boolean} loading
 */

const initAuthState = {
  loading: null,
  error: null,
  isAuthenticated: { status: false, currentUser: null },
};

const authReducer = (state = initAuthState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case AUTHENTICATED:
      return {
        ...state,
        error: null,
        loading: false,
        isAuthenticated: {
          status: true,
          currentUser: action.payload.user,
        },
      };
    case UPDATE_AUTHOR:
      return {
        ...state,
        error: null,
        isAuthenticated: {
          ...state.isAuthenticated,
          currentUser: {
            ...state.isAuthenticated.currentUser,
            author: action.payload.author
              ? action.payload.author
              : {
                  ...state.isAuthenticated.currentUser.author,
                  error: action.payload.error,
                },
          },
        },
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: {
          status: false,
          currentUser: null,
        },
      };

    default:
      return state;
  }
};

export default authReducer;
