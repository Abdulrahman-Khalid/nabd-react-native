import { CACHE_USER_ID } from './types';

export const cacheUserId = userId => {
  return {
    type: CACHE_USER_ID,
    payload: userId
  };
};
