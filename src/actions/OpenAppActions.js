import { SET_USER_TYPE, SET_WELCOME_INFO } from './types';
import axios from 'axios';

export const setUserType = userType => {
  return {
    type: SET_USER_TYPE,
    payload: userType
  };
};

export const getWelcomeInfo = () => {
  return dispatch => {
    console.log('here');
    axios
      .get('welcome/info')
      .then(({ data }) => {
        console.log('success');
        console.log(data);
        dispatch({ type: SET_WELCOME_INFO, payload: data });
      })
      .catch(error => {
        console.log('failed');
        console.log(error.status);
      });
  };
};
