import { AxiosError } from 'axios';
import { AuthService } from 'src/api';
import * as actions from '../actionTypes';

export const getLoggedInUser = () => {
  return async dispatch => {
    try {
      dispatch({ type: actions.LOADING });
      const result = await AuthService.loggedInUser();
      console.log(result);
      if (
        result.data?.loggedInUser &&
        result.data?.loggedInUser?.role.includes('admin')
      ) {
        dispatch({
          type: actions.AUTHENTICATED,
          payload: { user: result.data.loggedInUser },
        });
      } else {
        throw new Error(
          result.data?.loggedInUser
            ? 'You must be an admin to undertake this action!'
            : 'Something went wrong, please try login again',
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch({
          type: actions.AUTH_ERROR,
          payload: {
            error: {
              action: actions.LOADING,
              message:
                error.response?.data?.message ||
                error.response?.data?.invalidToken ||
                error.response?.data?.errorMessage ||
                error.message ||
                'Unknown error has occured',
              at: new Date(),
            },
          },
        });
        return;
      }
      dispatch({
        type: actions.AUTH_ERROR,
        payload: {
          error: {
            action: actions.LOADING,
            message: error.message,
            at: new Date(),
          },
        },
      });
    }
  };
};

export const signInAdmin = data => {
  return async dispatch => {
    try {
      dispatch({ type: actions.LOADING });
      if (data) {
        dispatch({
          type: actions.AUTHENTICATED,
          payload: { user: data },
        });
        return;
      }
      throw new Error(
        'Login went successfully but data being returned is unprecised',
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch({
          type: actions.AUTH_ERROR,
          payload: {
            error: {
              action: actions.AUTHENTICATED,
              message:
                error.response?.data?.message ||
                error.response?.data?.invalidEmail ||
                error.response?.data?.invalidPassword ||
                error.response?.data?.errorMessage ||
                error.message ||
                'Unknown error has occured',
              at: new Date(),
            },
          },
        });
        return;
      }
      dispatch({
        type: actions.AUTH_ERROR,
        payload: {
          error: {
            action: actions.AUTHENTICATED,
            message: error.message,
            at: new Date(),
          },
        },
      });
    }
  };
};

export const logOut = nav => {
  return async dispatch => {
    try {
      // dispatch({ type: actions.LOADING });
      const result = await AuthService.logoutUser();
      if (result.data?.successMessage) {
        dispatch({ type: actions.LOGOUT });
        nav('/');
      }
    } catch (error) {
      dispatch({
        type: actions.AUTH_ERROR,
        payload: {
          error: {
            action: actions.LOGOUT,
            message:
              error.response?.data?.errorMessage ||
              error.message ||
              'Unknown error has occured',
            at: new Date(),
          },
        },
      });
    }
  };
};

export const updateAuthor = (userId, body) => {
  return async dispatch => {
    try {
      const result = await AuthService.updateAuthorInfo(userId, body);
      if (
        result.data?.successMessage &&
        result.data?.updatedUser?.author
      ) {
        dispatch({
          type: actions.UPDATE_AUTHOR,
          payload: { author: result.data?.updatedUser?.author },
        });
      }
    } catch (error) {
      dispatch({
        type: actions.UPDATE_AUTHOR,
        payload: {
          error: {
            action: actions.UPDATE_AUTHOR,
            message:
              error.response?.data?.message ||
              error.response?.data?.invalidToken ||
              error.response?.data?.validationError ||
              error.message ||
              'Unknown error has occured',
            at: new Date(),
          },
        },
      });
    }
  };
};
