import {
  FILL_SIGNIN_FORM,
  SIGNIN_ATTEMPT,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  RESET_SIGNIN_REDUCER_STATE
} from './types';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';

export const resetSignInReducerState = () => {
  return {
    type: RESET_SIGNIN_REDUCER_STATE
  };
};

export const fillSignInForm = keyAndValue => {
  return {
    type: FILL_SIGNIN_FORM,
    payload: keyAndValue
  };
};

export const signInAttempt = signInInfo => {
  const { password, phone, userType } = signInInfo;
  return dispatch => {
    dispatch({
      type: SIGNIN_ATTEMPT,
      payload: phone
    });
    console.log('signInInfo', signInInfo);
    axios
      .post(`login/${userType}`, {
        phoneNo: phone.substring(1),
        password: password
      })
      .then(response => {
        AsyncStorage.multiSet([
          ['@app:session', response.data.token],
          ['@app:userType', userType]
        ])
          .then(() => {
            AsyncStorage.getItem('@app:session')
              .then(token => {
                axios.defaults.headers.common['TOKEN'] = token;
              })
              .catch(error => {})
              .then(() => {
                if (userType) Actions.home();
              });
          })
          .catch(error => {});
        console.log(response);
        dispatch({
          type: SIGNIN_SUCCESS
        });
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
