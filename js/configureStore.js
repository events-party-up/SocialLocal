
import { persistStore } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import devTools from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import reducer from './reducers';
import promise from './promise';
import {createLogger} from 'redux-logger';

export default function configureStore(onCompletion:()=>void):any {
  const logger = createLogger();

  
  
  // const middleware = [thunk, promise, logger ];
  const enhancer = compose(
    applyMiddleware(thunk, promise, logger),
    devTools({
      name: 'ReactNativeNativeBaseSeed', realtime: true,
    }),
  );
//   const composeEnhancers =
//   global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const enhancer = composeEnhancers(applyMiddleware(...middleware));

  const store = createStore(reducer, enhancer);
  persistStore(store, { storage: AsyncStorage }, onCompletion);

  return store;
}
