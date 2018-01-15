import {createReducer, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import tradeReducer from './state/reducer';
import { createStore } from 'redux';

let rootReducer = combineReducers({
    tradeState: tradeReducer
})

function loggerMiddleware(store){
    return function(next){
        return function(action){
            console.log("logger dispatching...", action);
            let result = next(action);
            console.log("next state: ",store.getState());

            return result;
        }
    }
}

let store = createStore(rootReducer, applyMiddleware(loggerMiddleware, thunk));

export default store;