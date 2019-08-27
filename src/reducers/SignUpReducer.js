import {
  FILL_SIGNUP_FORM,
  SIGNUP_ATTEMPT,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  CHECK_PASSWORD_STRENGTH,
  CHECK_PASSWORD_MATCH,
  CHECK_NAME,
  CHECK_BIRTHDAY,
  CHECK_PHONE
} from '../actions/types';

const INTIAL_STATE = {
  name: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: '',
  birthday: '',
  loading: false,
  passError: '',
  passStrengthText: '',
  passStrengthColor: 'white',
  passMatchError: '',
  nameError: '',
  birthdayError: '',
  phoneError: '',
  isSuccessName: false,
  isErrorName: false,
  isSuccessPhone: false,
  isErrorPhone: false,
  isSuccessPass: false,
  isErrorPass: false,
  isSuccessPassMatch: false,
  isErrorPassMatch: false
};

export default (state = INTIAL_STATE, action) => {
  var isValid = false;
  switch (action.type) {
    case FILL_SIGNUP_FORM:
      const { key, value } = action.payload;
      return { ...state, [key]: value };
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
    case CHECK_PASSWORD_STRENGTH:
      const {
        password,
        passError,
        passStrengthText,
        passStrengthColor
      } = action.payload;
      isValid = passError === '';
      return {
        ...state,
        password,
        passError,
        passStrengthText,
        passStrengthColor,
        isSuccessPass: isValid,
        isErrorPass: !isValid
      };
    case CHECK_PASSWORD_MATCH:
      isValid = action.payload === '';
      return {
        ...state,
        passMatchError: action.payload,
        isSuccessPassMatch: isValid,
        isErrorPassMatch: !isValid
      };
    case CHECK_NAME:
      isValid = action.payload === '';
      return {
        ...state,
        nameError: action.payload,
        isSuccessName: isValid,
        isErrorName: !isValid
      };
    case CHECK_PHONE:
      isValid = action.payload === '';
      return {
        ...state,
        phoneError: action.payload,
        isSuccessPhone: isValid,
        isErrorPhone: !isValid
      };
    case CHECK_BIRTHDAY:
      return {
        ...state,
        birthdayError: action.payload
      };
    default:
      return state;
  }
};
