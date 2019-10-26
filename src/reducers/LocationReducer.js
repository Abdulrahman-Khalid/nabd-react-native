import {
  GET_LOCATION,
  REQUEST_LOCATION_PERMISSION,
  UPDATE_LOCATION
} from '../actions/types';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistReducer } from 'redux-persist'

const INTIAL_STATE = {
  position: null,
  permissionGranted: false
};

locationReducer = (state = INTIAL_STATE, action) => {
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

const persistConfig = {
  key: 'location',
  storage: storage,
  whitelist: ['permissionGranted']
};

export default persistReducer(persistConfig, locationReducer);
