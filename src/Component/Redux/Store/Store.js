import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { UserReducer } from "../Reducers/UserReducer";
import { MessagesReducer } from "../Reducers/MessagesReducer";
import { createStore, combineReducers, applyMiddleware } from "redux";
const root = combineReducers({ UserReducer, MessagesReducer });

const store = createStore(
  root,
  composeWithDevTools(applyMiddleware(thunk, logger))
);
export default store;
