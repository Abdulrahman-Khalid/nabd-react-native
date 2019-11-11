import { UPDATE_AMBULANCE_NUMBER } from './types';

export const updateAmbulanceNumber = (ambulancePhoneNumber) => {
  console.log("action" + ambulancePhoneNumber)
  return {
    type: UPDATE_AMBULANCE_NUMBER,
    payload: ambulancePhoneNumber
  };
};
