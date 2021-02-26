// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.

importScripts("https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyAQJLNYFYyw3bCVEBrSa3h1a9TneCzZcRU",
  authDomain: "social-media-app-3ffb7.firebaseapp.com",
  projectId: "social-media-app-3ffb7",
  databaseURL: "https://social-media-app-3ffb7-default-rtdb.firebaseio.com/",
  storageBucket: "social-media-app-3ffb7.appspot.com",
  messagingSenderId: "433653096861",
  appId: "1:433653096861:web:6fbb01377533b1046f4f74",
  measurementId: "G-44KHP3WFJS",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize notification here
  const notificationTitle = `You have New Message From ${payload.data.userName}`;
  // if (payload.data.message) {
  //   audio.play();
  // }
  const notificationOptions = {
    body: `Message: ${payload.data.message}`,
    // sound: payload.data.sound,
    // icon: payload.data.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
