import { combineReducers } from 'redux';
import SignUpReducer from './SignUpReducer';
import OpenAppReducer from './OpenAppReducer';
import SignInReducer from './SignInReducer';

export default combineReducers({
  signup: SignUpReducer,
  signin: SignInReducer,
  openApp: OpenAppReducer
});
