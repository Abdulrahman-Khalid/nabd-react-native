import { ADDED_NEW_INCIDENT } from '../actions/types';

const INTIAL_STATE = {
  addedNewIncidentFlag: false,
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case ADDED_NEW_INCIDENT:
      return { ...state, addedNewIncidentFlag: !state.addedNewIncidentFlag}
    default:
      return state;
  }
};