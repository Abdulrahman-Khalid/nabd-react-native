import { CACHE_USER_ID } from '../actions/types';

const INTIAL_STATE = {
  userId: ''
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case CACHE_USER_ID:
      return { ...state, userId: action.payload };
    default:
      return state;
  }
};
