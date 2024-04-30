import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { createContext } from 'react';
import "firebase/firestore";

const root = ReactDOM.createRoot(document.getElementById('root'));
export const Context = createContext(null)

const firebaseConfig = {
  apiKey: "AIzaSyDzxePs273A_kAvACupEmpwzk5PGnFfToY",
  authDomain: "chat-react-848ff.firebaseapp.com",
  projectId: "chat-react-848ff",
  storageBucket: "chat-react-848ff.appspot.com",
  messagingSenderId: "118430921175",
  appId: "1:118430921175:web:f061b1b308f13eaa0e9b92",
  measurementId: "G-PC5M5RJ76C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const firestore = getFirestore(app)


root.render(
  <Context.Provider value={{  
    app,
    auth,
    firestore
  }}>
    <App />
  </Context.Provider>
);
