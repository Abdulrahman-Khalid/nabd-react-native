import { UPDATE_AMBULANCE_NUMBER, SET_AMBULANCE_TRACKING } from './types';

export const updateAmbulanceNumber = (ambulancePhoneNumber) => {
  return {
    type: UPDATE_AMBULANCE_NUMBER,
    payload: ambulancePhoneNumber
  };
};

export const setAmbulanceTracking = (continueAmbulanceTracking) => {
  return {
    type: SET_AMBULANCE_TRACKING,
    payload: continueAmbulanceTracking
  };
};
