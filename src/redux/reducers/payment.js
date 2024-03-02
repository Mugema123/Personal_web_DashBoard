import {
  GET_PAYMENTS,
  DECIDE_ON_PAYMENTS,
  PAYMENT_ERROR,
  PAYMENT_LOADING,
} from '../actionTypes';

const initPaymentState = {
  error: null,
  loading: true,
  allApplicationPayments: [],
};

const paymentReducer = (state = initPaymentState, action) => {
  switch (action.type) {
    case GET_PAYMENTS:
      return {
        error: null,
        loading: false,
        allApplicationPayments: [
          ...action.payload.allApplicationPayments,
        ],
      };
    case DECIDE_ON_PAYMENTS:
      return {
        error: null,
        allApplicationPayments: state.allApplicationPayments.map(
          payment =>
            payment._id !== action.payload.decidePayment._id
              ? payment
              : action.payload.decidePayment,
        ),
      };
    case PAYMENT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case PAYMENT_LOADING:
      return initPaymentState;
    default:
      return state;
  }
};

export default paymentReducer;
