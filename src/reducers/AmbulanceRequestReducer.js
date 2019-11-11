import { UPDATE_AMBULANCE_NUMBER } from '../actions/types';

const INTIAL_STATE = {
  ambulancePhoneNumber: null,
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_AMBULANCE_NUMBER:
      const { ambulancePhoneNumber } = action.payload;
      return { ...state, ambulancePhoneNumber }
    default:
      return state;
  }
};