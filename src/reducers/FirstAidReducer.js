import { INJURY_BUTTON_PRESSED } from '../actions/types';

const INTIAL_STATE = {
 injury: ''
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case INJURY_BUTTON_PRESSED:
      return { ...state, injury: action.payload };
    default:
      return state;
  }
};