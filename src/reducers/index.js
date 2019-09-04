import { combineReducers } from 'redux';
import SignUpReducer from './SignUpReducer';
import OpenAppReducer from './OpenAppReducer';
import SignInReducer from './SignInReducer';
import FirstAidReducer from './FirstAidReducer';
import RequestHelpReducer from './RequestHelpReducer';

export default combineReducers({
  signup: SignUpReducer,
  signin: SignInReducer,
  openApp: OpenAppReducer,
  firstAid: FirstAidReducer,
  requestHelp: RequestHelpReducer
});
