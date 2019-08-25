import { SET_USER_TYPE, SET_WELCOME_INFO } from '../actions/types';

const INTIAL_STATE = {
  userType: null,
  numberUsers: '-',
  numberDoctors: '-',
  numberParamedics: '-',
  numberAmbulance: '-'
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER_TYPE:
      return { ...state, userType: action.payload };
    case SET_WELCOME_INFO:
      const {
        numberDoctors,
        numberAmbulance,
        numberParamedics,
        numberUsers
      } = action.payload;
      return {
        ...state,
        numberUsers,
        numberDoctors,
        numberAmbulance,
        numberParamedics
      };
    default:
      return state;
  }
};
