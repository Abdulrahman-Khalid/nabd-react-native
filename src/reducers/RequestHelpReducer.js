import {
  REQUSET_DOCTOR,
  REQUSET_PARAMEDIC,
  REQUSET_AMBULANCE
} from '../actions/types';

const INTIAL_STATE = {
  helperType: null,
  helperName: null,
  helperSpecialization: null // in case the helper is a doctor
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case REQUSET_DOCTOR:
      // const { helperSpecialization, helperName } = action.payload;
      return {
        ...state,
        helperType: 'doctor',
        helperName: action.payload.helperName,
        helperSpecialization: action.payload.helperSpecialization
      };
    case REQUSET_PARAMEDIC:
      return {
        ...state,
        helperType: 'Paramedic',
        helperName: action.payload.helperName
      };
    case REQUSET_AMBULANCE:
      // const { helperName } = action.payload;
      return {
        ...state,
        helperType: 'ambulance',
        helperName: action.payload.helperName
      };
    default:
      return state;
  }
};
