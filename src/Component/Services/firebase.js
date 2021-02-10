import React from "react";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/storage";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAQJLNYFYyw3bCVEBrSa3h1a9TneCzZcRU",
  authDomain: "social-media-app-3ffb7.firebaseapp.com",
  projectId: "social-media-app-3ffb7",
  databaseURL: "https://social-media-app-3ffb7-default-rtdb.firebaseio.com/",
  storageBucket: "social-media-app-3ffb7.appspot.com",
  messagingSenderId: "433653096861",
  appId: "1:433653096861:web:6fbb01377533b1046f4f74",
  measurementId: "G-44KHP3WFJS",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// export const analytics = firebase.analytics();
export const auth = firebase.auth;
export const storage = firebase.storage();
export const database = firebase.database();
export default firebase;
