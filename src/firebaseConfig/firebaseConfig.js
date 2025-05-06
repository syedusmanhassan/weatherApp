// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrm9nWXe8xiQbBig9QCew_DA7h0MM8AJE",
  authDomain: "signup-and-login-f5898.firebaseapp.com",
  projectId: "signup-and-login-f5898",
  storageBucket: "signup-and-login-f5898.firebasestorage.app",
  messagingSenderId: "976324408500",
  appId: "1:976324408500:web:1b54eb1591d748f56253e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
