import { AxiosError } from 'axios';
import { MemberService } from 'src/api';
import * as actions from '../actionTypes';

export const getAllMembers = () => {
  return async dispatch => {
    try {
      const result = await MemberService.getMembers();
      if (!result.data.allStaffMembers) {
        throw new Error('Failed to retrieve staff members');
      }
      dispatch({
        type: actions.GET_MEMBERS,
        payload: {
          members: result.data.allStaffMembers,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.MEMBER_ERROR,
        payload: {
          error: {
            action: actions.GET_MEMBERS,
            message:
              error.message === 'Network Error'
                ? 'Server unreachable, please check your internet connection and try again'
                : 'Something went wrong while retrieving members, try again later',
            at: new Date(),
          },
        },
      });
    }
  };
};

export const addMember = data => async dispatch => {
  try {
    const response = await MemberService.createMember(data);
    dispatch({
      type: actions.ADD_MEMBER,
      payload: {
        message: {
          action: actions.ADD_MEMBER,
          success: response.data.successMessage,
        },
        member: response.data.staffContent,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.MEMBER_ERROR,
        payload: {
          error: {
            action: actions.ADD_MEMBER,
            message:
              error.response.data?.message ||
              error.response.data?.validationError ||
              error.message ||
              'Unknown error has occured',
            at: new Date(),
          },
        },
      });
      return;
    }
    dispatch({
      type: actions.MEMBER_ERROR,
      payload: {
        error: {
          action: actions.ADD_MEMBER,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};

export const editMember = (id, body) => async dispatch => {
  try {
    const response = await MemberService.editMember(id, body);
    dispatch({
      type: actions.EDIT_MEMBER,
      payload: {
        message: {
          action: actions.EDIT_MEMBER,
          success: response.data.successMessage,
        },
        member: response.data.staffMemberContent,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.MEMBER_ERROR,
        payload: {
          error: {
            action: actions.EDIT_MEMBER,
            message:
              error.response.data?.message ||
              error.message ||
              'Unknown error has occured',
            at: new Date(),
          },
        },
      });
      return;
    }
    dispatch({
      type: actions.MEMBER_ERROR,
      payload: {
        error: {
          action: actions.EDIT_MEMBER,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};

export const deleteMember = id => async dispatch => {
  try {
    const response = await MemberService.deleteMember(id);
    dispatch({
      type: actions.DELETE_MEMBER,
      payload: {
        message: {
          action: actions.DELETE_MEMBER,
          success: response.data.successMessage,
        },
        id,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.MEMBER_ERROR,
        payload: {
          error: {
            action: actions.DELETE_MEMBER,
            message:
              error.response.data?.message ||
              error.message ||
              'Unknown error has occured while deleting staff member',
            at: new Date(),
          },
        },
      });
      return;
    }
    dispatch({
      type: actions.MEMBER_ERROR,
      payload: {
        error: {
          action: actions.DELETE_MEMBER,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};
