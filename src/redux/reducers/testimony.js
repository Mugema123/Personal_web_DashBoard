import {
  ADD_TESTIMONIAL,
  DELETE_TESTIMONIAL,
  EDIT_TESTIMONIAL,
  GET_TESTIMONIALS,
  PUBLISH_TESTIMONIAL,
  TESTIMONIAL_ERROR,
} from '../actionTypes';

const initTestimonialState = {
  error: null,
  loading: true,
  testimonials: [],
};

const testimonialReducer = (state = initTestimonialState, action) => {
  switch (action.type) {
    case GET_TESTIMONIALS:
      return {
        error: null,
        loading: false,
        testimonials: [...action.payload.testimonials],
      };
    case ADD_TESTIMONIAL:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        testimonials: [
          action.payload.testimonial,
          ...state.testimonials,
        ],
      };
    case EDIT_TESTIMONIAL:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        testimonials: state.testimonials.map(testimonial =>
          testimonial._id !== action.payload.testimonial._id
            ? testimonial
            : action.payload.testimonial,
        ),
      };
    case DELETE_TESTIMONIAL:
      return {
        ...state,
        error: null,
        message: action.payload.message,
        testimonials: state.testimonials.filter(
          testimonial => testimonial._id !== action.payload.id,
        ),
      };
    case TESTIMONIAL_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default testimonialReducer;
