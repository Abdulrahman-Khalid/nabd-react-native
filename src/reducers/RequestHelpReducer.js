import {
  REQUSET_DOCTOR,
  REQUSET_PARAMEDIC,
  REQUSET_AMBULANCE,
  SELECT_HELPER_TYPE
} from '../actions/types';

const INTIAL_STATE = {
  helperType: null,
  helperName: null,
  helperSpecialization: null // in case the helper is a doctor
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_HELPER_TYPE:
      return { ...state, helperType: action.payload };
    case REQUSET_DOCTOR:
      // const { helperSpecialization, helperName } = action.payload;
      return {
        ...state,
        helperName: action.payload.helperName,
        helperSpecialization: action.payload.helperSpecialization
      };
    case REQUSET_PARAMEDIC:
      return {
        ...state,
        helperName: action.payload.helperName
      };
    case REQUSET_AMBULANCE:
      // const { helperName } = action.payload;
      return {
        ...state,
        helperName: action.payload.helperName
      };
    default:
      return state;
  }
};
