import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { UserReducer } from "../Reducers/UserReducer";
import { createStore, combineReducers, applyMiddleware } from "redux";
const root = combineReducers({ UserReducer });

const store = createStore(
  root,
  composeWithDevTools(applyMiddleware(thunk, logger))
);
export default store;
