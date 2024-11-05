// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";  

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6cZVxpQSmRS1kHY07YVjUhAYbUB3frIk",
  authDomain: "manemp-e9652.firebaseapp.com",
  projectId: "manemp-e9652",
  storageBucket: "manemp-e9652.firebasestorage.app",
  messagingSenderId: "1014402403580",
  appId: "1:1014402403580:web:4e3ca373b76a2becfbdb79",
  measurementId: "G-RHF6CQQJRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializando serviços
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };