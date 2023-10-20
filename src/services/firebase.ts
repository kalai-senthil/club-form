// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWkj9Hqhgvk9wfOS2Op4WPQKpLvLneFg8",
  authDomain: "fifth-bonbon-378112.firebaseapp.com",
  projectId: "fifth-bonbon-378112",
  storageBucket: "fifth-bonbon-378112.appspot.com",
  messagingSenderId: "637485073415",
  appId: "1:637485073415:web:581a795e342dd6e87516a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
