import { AxiosError } from 'axios';
import { SkillService } from 'src/api';
import * as actions from '../actionTypes';

export const getAllSkills = () => {
  return async dispatch => {
    try {
      const result = await SkillService.getSkills();
      if (!result.data.allSkills) {
        throw new Error('Failed to retrieve skills');
      }
      dispatch({
        type: actions.GET_SKILLS,
        payload: {
          skills: result.data.allSkills,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.SKILL_ERROR,
        payload: {
          error: {
            action: actions.GET_SKILLS,
            message:
              error.message === 'Network Error'
                ? 'Server unreachable, please check your internet connection and try again'
                : 'Something went wrong while retrieving skills, try again later',
            at: new Date(),
          },
        },
      });
    }
  };
};

export const addSkill = data => async dispatch => {
  try {
    const response = await SkillService.addSkills(data);
    dispatch({
      type: actions.ADD_SKILL,
      payload: {
        message: {
          action: actions.ADD_SKILL,
          success: response.data.successMessage,
        },
        skill: response.data.skillContent,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.SKILL_ERROR,
        payload: {
          error: {
            action: actions.ADD_SKILL,
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
      type: actions.SKILL_ERROR,
      payload: {
        error: {
          action: actions.ADD_SKILL,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};

export const editSkill = (id, body) => async dispatch => {
  try {
    const response = await SkillService.editSkills(id, body);
    dispatch({
      type: actions.EDIT_SKILL,
      payload: {
        message: {
          action: actions.EDIT_SKILL,
          success: response.data.successMessage,
        },
        skill: response.data.skillContent,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.SKILL_ERROR,
        payload: {
          error: {
            action: actions.EDIT_SKILL,
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
      type: actions.SKILL_ERROR,
      payload: {
        error: {
          action: actions.EDIT_SKILL,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};
export const publishSkill =
  (id, isPublic) => async dispatch => {
    try {
      const response = await SkillService.publishSkills(
        id,
        isPublic,
      );
      dispatch({
        type: actions.EDIT_SKILL,
        payload: {
          message: {
            action: actions.PUBLISH_SKILL,
            success: response.data.message,
          },
          skill: response.data.skill,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.SKILL_ERROR,
        payload: {
          error: {
            action: actions.PUBLISH_SKILL,
            message:
              error.response?.data?.message ||
              error.message ||
              'Unknown error has occured',
            at: new Date(),
          },
        },
      });
    }
  };

export const deleteSkill = id => async dispatch => {
  try {
    const response = await SkillService.deleteSkill(id);
    dispatch({
      type: actions.DELETE_SKILL,
      payload: {
        message: {
          action: actions.DELETE_SKILL,
          success: response.data.successMessage,
        },
        id,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.SKILL_ERROR,
        payload: {
          error: {
            action: actions.DELETE_SKILL,
            message:
              error.response.data?.message ||
              error.message ||
              'Unknown error has occured while deleting skill',
            at: new Date(),
          },
        },
      });
      return;
    }
    dispatch({
      type: actions.SKILL_ERROR,
      payload: {
        error: {
          action: actions.DELETE_SKILL,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};
