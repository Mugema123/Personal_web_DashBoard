import { UserService } from 'src/api';
import * as actions from '../actionTypes';
import { toast } from 'react-hot-toast';

export const getUsers = () => {
  return async dispatch => {
    try {
      const result = await UserService.getUsers();
      if (!result.data.RegisteredUsers) {
        throw new Error('Failed to retrieve staff members');
      }
      dispatch({
        type: actions.GET_USERS,
        payload: {
          users: result.data.RegisteredUsers,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.USER_ERROR,
        payload: {
          error: {
            action: actions.GET_USERS,
            message:
              error.message === 'Network Error'
                ? 'Server unreachable, please check your internet connection and try again'
                : 'Something went wrong while retrieving users, try again later',
            at: new Date(),
          },
        },
      });
    }
  };
};

export const deleteUser = id => async dispatch => {
  try {
    const response = await UserService.deleteUser(id);
    dispatch({
      type: actions.DELETE_USER,
      payload: {
        message: {
          action: actions.DELETE_USER,
          success: response.data.successMessage,
        },
        id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const editRole = (id, body) => async dispatch => {
  try {
    const response = await toast.promise(
      UserService.changeUserRole(id, body),
      {
        loading: 'Updating role, please wait...',
        success: 'User role updated successfully!',
        error: error => {
          if (error.response) {
            return `Error: ${error?.response?.data?.message}`;
          } else {
            return 'Something went wrong while updating user role, please try again';
          }
        },
      },
    );
    if (response.data?.successMessage) {
      dispatch({
        type: actions.CHANGE_ROLE,
        payload: {
          message: {
            action: actions.CHANGE_ROLE,
            success: response.data.successMessage,
          },
          updatedUser: response.data.updatedUser,
        },
      });
    }
  } catch (error) {}
};
