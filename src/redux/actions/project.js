import { AxiosError } from 'axios';
import { ProjectService } from 'src/api';
import * as actions from '../actionTypes';

export const getAllProjects = queries => {
  return async dispatch => {
    try {
      const result = await ProjectService.getProjects(queries);
      if (!result.data.allAvailableProjects) {
        throw new Error('Failed to retrieve projects');
      }

      dispatch({
        type: actions.GET_ALL_PROJECTS,
        payload: {
          projects: result.data.allAvailableProjects,
          paginationDetails: result.data.paginationDetails,
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch({
          type: actions.PROJECT_ERROR,
          payload: {
            error: {
              action: actions.GET_ALL_PROJECTS,
              message:
                error.response.data?.message ||
                error.response.data?.ProjectError ||
                error.message ||
                'Unknown error has occured',
              at: new Date(),
            },
          },
        });
        return;
      }
      dispatch({
        type: actions.PROJECT_ERROR,
        payload: {
          error: {
            action: actions.GET_ALL_PROJECTS,
            message: error.message,
            at: new Date(),
          },
        },
      });
    }
  };
};

export const addProject = data => async dispatch => {
  try {
    const response = await ProjectService.createProject(data);
    dispatch({
      type: actions.ADD_PROJECT,
      payload: {
        message: {
          action: actions.ADD_PROJECT,
          success:
            response.data.otherMessage ||
            response.data.successMessage,
        },
        project: response.data.projectContent,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.PROJECT_ERROR,
        payload: {
          error: {
            action: actions.ADD_PROJECT,
            message:
              error.response.data?.message ||
              error.response.data?.duplicationError ||
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
      type: actions.PROJECT_ERROR,
      payload: {
        error: {
          action: actions.ADD_PROJECT,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};

export const editProject = (slug, data) => async dispatch => {
  try {
    const response = await ProjectService.editProject(slug, data);
    dispatch({
      type: actions.EDIT_PROJECT,
      payload: {
        message: {
          action: actions.EDIT_PROJECT,
          success: response.data.projectUpdateSuccess,
        },
        project: response.data.updatedProject,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.PROJECT_ERROR,
        payload: {
          error: {
            action: actions.EDIT_PROJECT,
            message:
              error.response.data?.message ||
              error.response.data?.ProjectUpdateError ||
              error.message ||
              'Unknown error has occured',
            at: new Date(),
          },
        },
      });
      return;
    }
    dispatch({
      type: actions.PROJECT_ERROR,
      payload: {
        error: {
          action: actions.EDIT_PROJECT,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};

export const deleteProject = id => async dispatch => {
  try {
    const response = await ProjectService.deleteProject(id);
    dispatch({
      type: actions.DELETE_PROJECT,
      payload: {
        message: {
          action: actions.DELETE_PROJECT,
          success: response.data.deletedProject,
        },
        id,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.PROJECT_ERROR,
        payload: {
          error: {
            action: actions.DELETE_PROJECT,
            message:
              error.response.data?.message ||
              error.response.data?.invalidId ||
              error.response.data?.ProjectUpdateError ||
              error.message ||
              'Unknown error has occured while deleting project',
            at: new Date(),
          },
        },
      });
      return;
    }
    dispatch({
      type: actions.PROJECT_ERROR,
      payload: {
        error: {
          action: actions.DELETE_PROJECT,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};
