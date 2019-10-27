import {
  FILL_SIGNIN_FORM,
  SIGNIN_ATTEMPT,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  RESET_SIGNIN_REDUCER_STATE
} from '../actions/types';

const INTIAL_STATE = {
  phone: '',
  password: '',
  loading: false,
  userName: ''
};

signInReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case RESET_SIGNIN_REDUCER_STATE:
      return INTIAL_STATE;
    case FILL_SIGNIN_FORM:
      const { key, value } = action.payload;
      return { ...state, [key]: value };
    case SIGNIN_ATTEMPT:
      return {
        ...state,
        loading: true
      };
    case SIGNIN_SUCCESS:
      return { ...state, loading: false };
    case SIGNIN_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const persistConfig = {
  key: 'signin',
  storage: storage,
  whitelist: ['phone', 'password', 'userName']
};

export default persistReducer(persistConfig, signInReducer);
