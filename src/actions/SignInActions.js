import {
  FILL_SIGNIN_FORM,
  SIGNIN_ATTEMPT,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL
} from './types';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

export const fillSignInForm = keyAndValue => {
  return {
    type: FILL_SIGNIN_FORM,
    payload: keyAndValue
  };
};

export const signInAttempt = signInInfo => {
  return dispatch => {
    dispatch({
      type: SIGNIN_ATTEMPT,
      payload: signInInfo.phone
    });
    console.log(signInInfo);
    axios
      .post(`login/${signInInfo.userType}`, {
        phoneNo: signInInfo.phone.substring(1),
        password: signInInfo.password
      })
      .then(response => {
        console.log(response);
        dispatch({
          type: SIGNIN_SUCCESS
        });
        Actions.home();
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: SIGNIN_FAIL,
          payload: 'Authentication failed'
        });
      });
  };
};
