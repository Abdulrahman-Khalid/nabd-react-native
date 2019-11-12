import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import ReduxThunk from 'redux-thunk'
import rootReducer from '../reducers'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['language', 'ambulanceRequest']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(persistedReducer, {}, applyMiddleware(ReduxThunk));
  return { store };
}