import {
  FILL_SIGNUP_FORM,
  SIGNUP_ATTEMPT,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL
} from '../actions/types';

const INTIAL_STATE = {
  name: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: '',
  birthday: '',
  loading: false
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case FILL_SIGNUP_FORM:
      return { ...state, [action.payload.key]: action.payload.value };
    case SIGNUP_ATTEMPT:
      return {
        ...state,
        phone: action.payload,
        loading: true
      };
    case SIGNUP_SUCCESS:
      return { ...state, password: '', confirmPassword: '', loading: false };
    case SIGNUP_FAIL:
      return {
        ...state,
        password: '',
        confirmPassword: '',
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};
