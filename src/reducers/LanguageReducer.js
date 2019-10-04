import { SWITCH_LANGUAGE } from '../actions/types';

const INTIAL_STATE = {
  lang: 'ar',
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_LANGUAGE:
      const { lang } = action.payload;
      return { ...state, lang }
    default:
      return state;
  }
};