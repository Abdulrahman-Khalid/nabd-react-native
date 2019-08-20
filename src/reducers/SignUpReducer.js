import { SIGNUP_ATTEMPT } from '../actions/types';

const INTIAL_STATE = { name: '', phone: '', shift: '' }; //shift: "Monday"

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SIGNUP_ATTEMPT:
      return state;
    default:
      return state;
  }
};
