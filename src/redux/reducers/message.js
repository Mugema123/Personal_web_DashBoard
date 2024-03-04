import {
    DELETE_MESSAGE,
    EDIT_MESSAGE,
    GET_ALL_MESSAGES,
  } from "../actionTypes";
  
  const messageReducer = (
    state = {
      messages: [],
      loading: true,
    },
    action
  ) => {
    switch (action.type) {
      case GET_ALL_MESSAGES:
        return {
          ...state,
          loading: false,
          messages: [...action.payload.messages],
        };
      case EDIT_MESSAGE:
        return {
          ...state,
          messages: state.messages.map((message) =>
            message._id !== action.payload.message._id
              ? message
              : action.payload.message
          ),
        };
      case DELETE_MESSAGE:
        return {
          ...state,
          messages: state.messages.filter(
            (message) => message._id !== action.payload.id
          ),
        };
      default:
        return state;
    }
  };
  
  export default messageReducer;
  