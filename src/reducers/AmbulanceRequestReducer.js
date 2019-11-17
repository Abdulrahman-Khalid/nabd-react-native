import { UPDATE_AMBULANCE_NUMBER, SET_AMBULANCE_TRACKING } from '../actions/types';

const INTIAL_STATE = {
  ambulancePhoneNumber: null,
  continueAmbulanceTracking: false
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_AMBULANCE_NUMBER:
      const ambulancePhoneNumber = action.payload;
      return { ...state, ambulancePhoneNumber }
    case SET_AMBULANCE_TRACKING:
      const continueAmbulanceTracking = action.payload;
      return { ...state, continueAmbulanceTracking }
    default:
      return state;
  }
};