import { SWITCH_LANGUAGE } from '../actions/types';

const initialState = {
  lang: 'ar',
  rtl: true,
};

export default (state = initialState, action) => {
  const { lang, rtl } = action;
  switch (action.type) {
    case SWITCH_LANGUAGE:
      return Object.assign({}, state, {
        lang,
        rtl,
      });
    default:
      return state;
  }
};