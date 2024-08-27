// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsp4B6iItDzX_ctoFSQVkyagC4tnYqCfQ",
  authDomain: "flash-ai-f95eb.firebaseapp.com",
  projectId: "flash-ai-f95eb",
  storageBucket: "flash-ai-f95eb.appspot.com",
  messagingSenderId: "827481533201",
  appId: "1:827481533201:web:d9f80fef1be752d665fab0",
  measurementId: "G-FMQ5HS5B97"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app); 
export const db = getFirestore(app) 

