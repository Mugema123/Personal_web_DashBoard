import * as actions from '../actionTypes';

export const getAllMessages = ({ messages = [] }) => {
  return {
    type: actions.GET_ALL_MESSAGES,
    payload: {
      messages,
    },
  };
};

export const editMessage = (message) => ({
  type: actions.EDIT_MESSAGE,
  payload: {
    message,
  },
});

export const deleteMessage = (id) => ({
  type: actions.DELETE_MESSAGE,
  payload: {
    id,
  },
});
