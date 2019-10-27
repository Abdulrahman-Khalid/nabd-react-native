import {
  FILL_SIGNIN_FORM,
  SIGNIN_ATTEMPT,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  RESET_SIGNIN_REDUCER_STATE
} from './types';
import axios from 'axios';
import { info } from '../constants';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { Voximplant } from 'react-native-voximplant';

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
        loginVoximplant(phone);
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

async function loginVoximplant(phone) {
  const client = Voximplant.getInstance();
  try {
    let state = await client.getClientState();
    if (state === Voximplant.ClientState.DISCONNECTED) {
      await client.connect();
    }
    let authResult = await client.login(phone, info.userPass);
  } catch (e) {
    console.log(e.name + e.message);
  }
}
