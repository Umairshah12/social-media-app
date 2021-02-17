import firebase from "../../Services/firebase";
import axios from "axios";
export const FETCH_USER = "FETCH_USER";
export const FETCH_ALL_USERS = "FETCH_ALL_USERS";
export const REGISTER_USER = "REGISTER_USER";
export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const FAILIURE_ERRORS = "FAILIURE_ERRORS";
export const OPEN_DAILOG = "OPEN_DAILOG";
export const CLOSE_DAILOG = "CLOSE_DAILOG";
export const NEW_POST = "NEW_POST";
export const FETCH_ALL_POSTS = "FETCH_ALL_POSTS";
export const REMOVE_POST = "REMOVE_POST";
export const OPEN_COMMENT_DAILOG = "OPEN_COMMENT_DAILOG";
export const CLOSE_COMMENT_DAILOG = "CLOSE_COMMENT_DAILOG";
export const FETCH_ALL_POST_COMMENTS = "FETCH_ALL_POST_COMMENTS";

export const fetchUser = (snapValue) => {
  return {
    type: FETCH_USER,
    payload: snapValue,
  };
};

export const fetchAllUsers = (snapValue) => {
  return {
    type: FETCH_ALL_USERS,
    payload: snapValue,
  };
};

export const registerUser = (formInputs) => {
  return {
    type: REGISTER_USER,
    payload: { formInputs },
  };
};

export const loginUser = (loginData) => {
  return {
    type: LOGIN_USER,
    payload: { loginData },
  };
};

export const logOutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};

export const FailureError = (error) => {
  return {
    type: FAILIURE_ERRORS,
    payload: error,
  };
};

export const openDailog = () => {
  return {
    type: OPEN_DAILOG,
  };
};

export const closeDailog = () => {
  return {
    type: CLOSE_DAILOG,
  };
};

export const makeNewPost = (postData) => {
  return {
    type: NEW_POST,
    payload: postData,
  };
};

export const fetchAllPosts = (postData) => {
  return {
    type: FETCH_ALL_POSTS,
    payload: postData,
  };
};

export const RemovePost = (KEY) => {
  return {
    type: REMOVE_POST,
    payload: KEY,
  };
};

export const openCommentDailog = (id) => {
  return {
    type: OPEN_COMMENT_DAILOG,
    payload: id,
  };
};

export const closeCommentDailog = () => {
  return {
    type: CLOSE_COMMENT_DAILOG,
  };
};

export const fetchAllPostComments = (comments) => {
  return {
    type: FETCH_ALL_POST_COMMENTS,
    payload: comments,
  };
};
