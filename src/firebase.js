import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCE6u2JY9lbFoGW226MZY-wlghCzvubp7s",
  authDomain: "scum-62abd.firebaseapp.com",
  projectId: "scum-62abd",
  storageBucket: "scum-62abd.appspot.com",
  messagingSenderId: "136430428960",
  appId: "1:136430428960:web:4f6a18e9395c899f81ed45",
  measurementId: "G-T9112R05QW",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
