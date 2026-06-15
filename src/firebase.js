import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLivpIgJ2tEjZDd_v4byEZ2c3s7XjRcw4",
  authDomain: "adometer-f7a03.firebaseapp.com",
  projectId: "adometer-f7a03",
  storageBucket: "adometer-f7a03.firebasestorage.app",
  messagingSenderId: "539791346446",
  appId: "1:539791346446:web:0870173c38313ef88f655f",
  measurementId: "G-QW159B7M3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
