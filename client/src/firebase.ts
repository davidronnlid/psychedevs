// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvUK0PS5TRE_WKJgrbA_2fkhoqrEMHkEo",
  authDomain: "psychedevs-34c69.firebaseapp.com",
  projectId: "psychedevs-34c69",
  storageBucket: "psychedevs-34c69.appspot.com",
  messagingSenderId: "11693023802",
  appId: "1:11693023802:web:14c8a007a66cdfb2f08b03",
  measurementId: "G-FV84CCR63B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export { messaging, getToken, onMessage, analytics };
