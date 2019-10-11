import {
  GET_LOCATION,
  REQUEST_LOCATION_PERMISSION,
  UPDATE_LOCATION
} from '../actions/types';

const INTIAL_STATE = {
  position: null,
  permissionGranted: false
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case GET_LOCATION:
      return { ...state, position: action.payload };
    case REQUEST_LOCATION_PERMISSION:
      return { ...state, permissionGranted: action.payload };
    case UPDATE_LOCATION:
      return { ...state, position: action.payload };
    default:
      return state;
  }
};
