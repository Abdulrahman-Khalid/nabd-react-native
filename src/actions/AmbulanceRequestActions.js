import { UPDATE_AMBULANCE_NUMBER } from './types';

export const updateAmbulanceNumber = (ambulancePhoneNumber) => {
  return {
    type: UPDATE_AMBULANCE_NUMBER,
    payload: ambulancePhoneNumber
  };
};
