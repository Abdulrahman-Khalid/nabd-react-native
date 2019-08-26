import {
  FILL_SIGNIN_FORM,
  SIGNIN_ATTEMPT,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL
} from '../actions/types';

const INTIAL_STATE = {
  phone: '',
  password: '',
  loading: false
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case FILL_SIGNIN_FORM:
      const { key, value } = action.payload;
      return { ...state, [key]: value };
    case SIGNIN_ATTEMPT:
      return {
        ...state,
        loading: true
      };
    case SIGNIN_SUCCESS:
      return { ...state, loading: false };
    case SIGNIN_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
