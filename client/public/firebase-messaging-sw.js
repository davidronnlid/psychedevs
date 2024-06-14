// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js");

// Your web app's Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
