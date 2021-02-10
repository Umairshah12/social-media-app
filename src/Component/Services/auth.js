import { auth } from "./firebase";

export function Signup(email, password) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function LogIn(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

// export function SignInWithGoogle() {
//   const provider = new auth.GoogleAuthProvider();
//   return auth().signInWithPopup(provider);
// }

// export function SignInWithGithub() {
//   const provider = new auth.GithubAuthProvider();
//   return auth().signInWithPopup(provider);
// }

export function logout() {
  return auth().signOut();
}
