import { AxiosError } from 'axios';
import { TestimonialService } from 'src/api';
import * as actions from '../actionTypes';

export const getAllTestimonials = () => {
  return async dispatch => {
    try {
      const result = await TestimonialService.getTestimonials();
      if (!result.data.allTestimonials) {
        throw new Error('Failed to retrieve testimonials');
      }
      dispatch({
        type: actions.GET_TESTIMONIALS,
        payload: {
          testimonials: result.data.allTestimonials,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.TESTIMONIAL_ERROR,
        payload: {
          error: {
            action: actions.GET_TESTIMONIALS,
            message:
              error.message === 'Network Error'
                ? 'Server unreachable, please check your internet connection and try again'
                : 'Something went wrong while retrieving testimonials, try again later',
            at: new Date(),
          },
        },
      });
    }
  };
};

export const addTestimonial = data => async dispatch => {
  try {
    const response = await TestimonialService.addTestimony(data);
    dispatch({
      type: actions.ADD_TESTIMONIAL,
      payload: {
        message: {
          action: actions.ADD_TESTIMONIAL,
          success: response.data.successMessage,
        },
        testimonial: response.data.testimonialContent,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.TESTIMONIAL_ERROR,
        payload: {
          error: {
            action: actions.ADD_TESTIMONIAL,
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
      type: actions.TESTIMONIAL_ERROR,
      payload: {
        error: {
          action: actions.ADD_TESTIMONIAL,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};

export const editTestimonial = (id, body) => async dispatch => {
  try {
    const response = await TestimonialService.editTestimony(id, body);
    dispatch({
      type: actions.EDIT_TESTIMONIAL,
      payload: {
        message: {
          action: actions.EDIT_TESTIMONIAL,
          success: response.data.successMessage,
        },
        testimonial: response.data.testimonialContent,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.TESTIMONIAL_ERROR,
        payload: {
          error: {
            action: actions.EDIT_TESTIMONIAL,
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
      type: actions.TESTIMONIAL_ERROR,
      payload: {
        error: {
          action: actions.EDIT_TESTIMONIAL,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};
export const publishTestimonial =
  (id, isPublic) => async dispatch => {
    try {
      const response = await TestimonialService.publishTestimony(
        id,
        isPublic,
      );
      dispatch({
        type: actions.EDIT_TESTIMONIAL,
        payload: {
          message: {
            action: actions.PUBLISH_TESTIMONIAL,
            success: response.data.message,
          },
          testimonial: response.data.testimonial,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.TESTIMONIAL_ERROR,
        payload: {
          error: {
            action: actions.PUBLISH_TESTIMONIAL,
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

export const deleteTestimonial = id => async dispatch => {
  try {
    const response = await TestimonialService.deleteTestimonial(id);
    dispatch({
      type: actions.DELETE_TESTIMONIAL,
      payload: {
        message: {
          action: actions.DELETE_TESTIMONIAL,
          success: response.data.successMessage,
        },
        id,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: actions.TESTIMONIAL_ERROR,
        payload: {
          error: {
            action: actions.DELETE_TESTIMONIAL,
            message:
              error.response.data?.message ||
              error.message ||
              'Unknown error has occured while deleting testimonial',
            at: new Date(),
          },
        },
      });
      return;
    }
    dispatch({
      type: actions.TESTIMONIAL_ERROR,
      payload: {
        error: {
          action: actions.DELETE_TESTIMONIAL,
          message: error.message,
          at: new Date(),
        },
      },
    });
  }
};
