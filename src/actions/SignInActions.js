import {
  FILL_SIGNIN_REDUCER,
  SIGNIN_ATTEMPT,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  RESET_SIGNIN_REDUCER_STATE
} from './types';
import t from '../I18n';
import axios from 'axios';
import { info } from '../constants';
import { Actions } from 'react-native-router-flux';
import { Voximplant } from 'react-native-voximplant';
import LoginManager from '../app/videoCall/manager/LoginManager';

export const resetSignInReducerState = () => {
  return dispatch => {
    dispatch({
      type: RESET_SIGNIN_REDUCER_STATE
    });
    Actions.reset('welcome');
  }
};

export const fillSignInReducer = keyAndValue => {
  return {
    type: FILL_SIGNIN_REDUCER,
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
        console.log('login success');
        loginVoximplant(phone);
        axios.defaults.headers.common['TOKEN'] = response.data.token;
        const payloaded = {
          token: response.data.token,
          userName: response.data.userName,
          specialization:
            userType === 'doctor' ? response.data.specialization : null,
          userType
        };
        dispatch({
          type: SIGNIN_SUCCESS,
          payload: payloaded
        });
        switch (userType) {
          case 'user':
            Actions.reset('userHome');
            break;
          case 'doctor':
            Actions.reset('doctorHome');
            break;
          case 'paramedic':
            Actions.reset('paramedicHome');
            break;
          case 'ambulance':
            Actions.reset('ambulanceHome');
            break;
        }
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: SIGNIN_FAIL,
          payload: t.AuthFailed
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
    LoginManager.getInstance()
      .loginWithPassword(phone + info.voxAccount, info.userPass)
      .then(() => {
        console.log('login voximplant successfully first time ');
      });
    let authResult = await client.login(phone, info.userPass);
  } catch (e) {
    console.log(e.name + e.message);
  }
}
