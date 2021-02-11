import {
  FETCH_USER,
  REGISTER_USER,
  LOGIN_USER,
  LOGOUT_USER,
  FAILIURE_ERRORS,
  FETCH_ALL_USERS,
  OPEN_DAILOG,
  CLOSE_DAILOG,
  NEW_POST,
  FETCH_ALL_POSTS,
  REMOVE_POST,
} from "../Actions/UserAction";

const initialState = {
  users: {},
  loginUser: {},
  errors: "",
  currentfetchedUser: {},
  openDailogData: false,
  newPosts: [],
  fetchPosts: [],
};

export function UserReducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        // users: action.payload,
        error: "",
      };

    case LOGIN_USER:
      return {
        ...state,
        loginUser: action.payload,
        error: "",
      };

    case LOGOUT_USER:
      return {
        ...state,
        loginUser: {},
        users: [],
        error: "",
      };

    case FAILIURE_ERRORS:
      return { ...state, error: action.payload };

    case FETCH_USER:
      return { ...state, currentfetchedUser: action.payload };

    case FETCH_ALL_USERS:
      return { ...state, users: action.payload };

    case OPEN_DAILOG:
      return { ...state, openDailogData: true };

    case CLOSE_DAILOG:
      return { ...state, openDailogData: false };

    case NEW_POST:
      return { ...state, newPosts: action.payload, openDailogData: false };

    case FETCH_ALL_POSTS:
      return { ...state, fetchPosts: action.payload };

    case REMOVE_POST:
      return { ...state };
    default:
      return state;
  }
}
