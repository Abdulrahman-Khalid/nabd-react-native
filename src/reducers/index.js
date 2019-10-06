import { combineReducers } from 'redux';
import SignUpReducer from './SignUpReducer';
import OpenAppReducer from './OpenAppReducer';
import SignInReducer from './SignInReducer';
import FirstAidReducer from './FirstAidReducer';
import RequestHelpReducer from './RequestHelpReducer';
import LanguageReducer from './LanguageReducer';
import CachedReducer from './CachedReducer';
import CallReducer from './CallReducer';

export default combineReducers({
  signup: SignUpReducer,
  signin: SignInReducer,
  openApp: OpenAppReducer,
  firstAid: FirstAidReducer,
  requestHelp: RequestHelpReducer,
  language: LanguageReducer,
  cached: CachedReducer,
  call: CallReducer
});
