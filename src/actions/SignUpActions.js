import {
  FILL_SIGNUP_FORM,
  SIGNUP_ATTEMPT,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL
} from './types';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

export const fillSignUpForm = keyAndValue => {
  return {
    type: FILL_SIGNUP_FORM,
    payload: keyAndValue
  };
};

export const signUpAttempt = signUpInfo => {
  return dispatch => {
    dispatch({
      type: SIGNUP_ATTEMPT,
      payload: signUpInfo.phone
    });
    console.log(signUpInfo);
    axios
      .post(`register/${signUpInfo.userType}`, {
        name: signUpInfo.name,
        phoneNo: signUpInfo.phone.substring(1),
        birthDate: signUpInfo.birthday,
        gender: signUpInfo.gender === 'male',
        password: signUpInfo.password
      })
      .then(response => {
        console.log(response);
        dispatch({
          type: SIGNUP_SUCCESS
        });
        Actions.verifySignup({
          phoneNum: this.phone.getValue()
        });
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: SIGNUP_FAIL,
          payload: 'sign up failed'
        });
      });
  };
};
