import {
  FILL_SIGNIN_REDUCER,
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
          userType
        };
        dispatch({
          type: SIGNIN_SUCCESS,
          payload: payloaded
        });
        switch (userType) {
          case 'user':
            Actions.userHome();
            break;
          case 'doctor':
            Actions.doctorHome();
            break;
          case 'paramedic':
            Actions.paramedicHome();
            break;
          case 'ambulance':
            Actions.ambulanceHome();
            break;
        }
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
    LoginManager.getInstance().loginWithPassword(
      phone + info.voxAccount,
      info.userPass
    );
    let authResult = await client.login(phone, info.userPass);
  } catch (e) {
    console.log(e.name + e.message);
  }
}
