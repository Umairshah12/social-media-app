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
  OPEN_COMMENT_DAILOG,
  CLOSE_COMMENT_DAILOG,
  FETCH_ALL_POST_COMMENTS,
} from "../Actions/UserAction";

const initialState = {
  users: {},
  loginUser: {},
  errors: "",
  currentfetchedUser: {},
  openDailogData: false,
  newPosts: [],
  postSpecificComments: [],
  fetchPosts: [],
  commentDailog: false,
  commentId: "",
};

export function UserReducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
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
      return {
        ...state,
        newPosts: action.payload,
        openDailogData: false,
        commentDailog: false,
      };

    case FETCH_ALL_POSTS:
      return { ...state, fetchPosts: action.payload };

    case REMOVE_POST:
      return { ...state };

    case OPEN_COMMENT_DAILOG:
      return {
        ...state,
        commentDailog: true,
        commentId: action.payload,
      };
    case CLOSE_COMMENT_DAILOG:
      return { ...state, commentDailog: false };

    case FETCH_ALL_POST_COMMENTS:
      return { ...state, postSpecificComments: action.payload };
    default:
      return state;
  }
}
