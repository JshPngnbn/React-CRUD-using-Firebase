import firebase from "firebase/compat/app";
import "firebase/compat/database";

const app = firebase.initializeApp({
  apiKey: "--",
  authDomain: "crud-708d8.firebaseapp.com",
  projectId: "crud-708d8",
  storageBucket: "crud-708d8.appspot.com",
  messagingSenderId: "--",
  appId: "--",
  measurementId: "--",
});

export const database = app.database().ref();
export default app;
