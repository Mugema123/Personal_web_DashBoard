import { AxiosError } from 'axios';
import { ServicesAPI } from 'src/api';
import * as actions from '../actionTypes';

export const getAllServices = () => {
  return async dispatch => {
    try {
      const result = await ServicesAPI.getServices();
      if (!result.data.allServices) {
        throw new Error('Failed to retrieve services');
      }
      dispatch({
        type: actions.GET_SERVICES,
        payload: {
          services: result.data.allServices,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.SERVICE_ERROR,
        payload: {
          error: {
            action: actions.GET_SERVICES,
            message:
              error.message === 'Network Error'
                ? 'Server unreachable, please check your internet connection and try again'
                : 'Something went wrong while retrieving services, try again later',
            at: new Date(),
          },
        },
      });
    }
  };
};

export const addService = data => async dispatch => {
  try {
    const response = await ServicesAPI.createService(data);
    dispatch({
      type: actions.ADD_SERVICE,
      payload: {
        message: {
          action: actions.ADD_SERVICE,
          success: response.data.successMessage,
        },
        service: response.data.serviceContent,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.SERVICE_ERROR,
        payload: {
          error: {
            action: actions.ADD_SERVICE,
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
      type: actions.SERVICE_ERROR,
      payload: {
        error: {
          action: actions.ADD_SERVICE,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};

export const editService = (id, body) => async dispatch => {
  try {
    const response = await ServicesAPI.editService(id, body);
    dispatch({
      type: actions.EDIT_SERVICE,
      payload: {
        message: {
          action: actions.EDIT_SERVICE,
          success: response.data.successMessage,
        },
        service: response.data.serviceContent,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.SERVICE_ERROR,
        payload: {
          error: {
            action: actions.EDIT_SERVICE,
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
      type: actions.SERVICE_ERROR,
      payload: {
        error: {
          action: actions.EDIT_SERVICE,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};

export const deleteService = id => async dispatch => {
  try {
    const response = await ServicesAPI.deleteService(id);
    dispatch({
      type: actions.DELETE_SERVICE,
      payload: {
        message: {
          action: actions.DELETE_SERVICE,
          success: response.data.successMessage,
        },
        id,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.SERVICE_ERROR,
        payload: {
          error: {
            action: actions.DELETE_SERVICE,
            message:
              error.response.data?.message ||
              error.message ||
              'Unknown error has occured while deleting service',
            at: new Date(),
          },
        },
      });
      return;
    }
    dispatch({
      type: actions.SERVICE_ERROR,
      payload: {
        error: {
          action: actions.DELETE_SERVICE,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};
