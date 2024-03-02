import { paymentService } from 'src/api';
import * as actions from '../actionTypes';

export const getPayments = applicationId => {
  return async dispatch => {
    try {
      dispatch({ type: actions.PAYMENT_LOADING });
      const result = await paymentService.getApplicationPayments(
        applicationId,
      );
      if (!result.data.allAvailablePayments) {
        throw new Error('Failed to retrieve application payments');
      }
      dispatch({
        type: actions.GET_PAYMENTS,
        payload: {
          allApplicationPayments: result.data.allAvailablePayments,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.PAYMENT_ERROR,
        payload: {
          error: {
            action: actions.GET_PAYMENTS,
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

export const approveOrDeclinePayments = (id, body) => {
  return async dispatch => {
    try {
      const response = await paymentService.decideOnPayments(
        id,
        body,
      );
      dispatch({
        type: actions.DECIDE_ON_PAYMENTS,
        payload: {
          decidePayment: response.data.updatedPayment,
        },
      });
    } catch (error) {
      dispatch({
        type: actions.PAYMENT_ERROR,
        payload: {
          error: {
            action: actions.DECIDE_ON_PAYMENTS,
            message: error.message,
            at: new Date(),
          },
        },
      });
    }
  };
};
