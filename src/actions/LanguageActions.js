import { SWITCH_LANGUAGE } from './types';

export const switchLanguage = (dispatch, language) => {
  dispatch({ type: types.SWITCH_LANGUAGE, ...language });
};
