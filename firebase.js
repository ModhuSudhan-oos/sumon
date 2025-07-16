import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js";

const firebaseConfig = {
  apiKey: "AIzaSyA4tZJUjHDZ0JAh394flCqL6SSu8GoVskA",
  authDomain: "modhusudhan-c8300.firebaseapp.com",
  projectId: "modhusudhan-c8300",
  storageBucket: "modhusudhan-c8300.appspot.com",
  messagingSenderId: "884138452056",
  appId: "1:884138452056:web:1cb1481d42337c6af2962d",
  measurementId: "G-0D30XWCLB0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
