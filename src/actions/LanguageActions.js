import { SWITCH_LANGUAGE } from './types';

export const switchLanguage = (language) => {
  return {
    type: SWITCH_LANGUAGE,
    payload: language
  };
};
