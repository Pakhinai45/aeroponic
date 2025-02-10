import { initializeApp } from "firebase/app";
import { getAuth , signInWithEmailAndPassword } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHb7c71eD80O8pF-l3JFqXiNaqMZb6xDI",
  authDomain: "aeroponics-e15b0.firebaseapp.com",
  databaseURL: "https://aeroponics-e15b0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aeroponics-e15b0",
  storageBucket: "aeroponics-e15b0.appspot.com",
  messagingSenderId: "810278392432",
  appId: "1:810278392432:web:a91e7c0b98f5dc5b855ab5",
  measurementId: "G-DK4EM20L5M"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, signInWithEmailAndPassword, db };
