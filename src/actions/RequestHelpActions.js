import { SELECT_HELPER_TYPE, SELECT_HELPER_SPECIALIZATION } from './types';

import axios from 'axios';

export const selectHelperType = helperType => {
  return {
    type: SELECT_HELPER_TYPE,
    payload: helperType
  };
};

export const selectHelperSpecialization = specialization => {
  return {
    type: SELECT_HELPER_SPECIALIZATION,
    payload: specialization
  };
};

export const requestHelp = helperType => {
  return dispatch => {
    console.log('here');
    axios
      .get(`request/${helperType}`)
      .then(({ data }) => {
        dispatch({ type: `request_${helperType}`, payload: data });
        console.log('success');
        console.log(data);
      })
      .catch(error => {
        console.log('failed');
        console.log(error.status);
      });
  };
};

//(doctor, ambulance and paramedic can access the medical backgorund of the caller)
