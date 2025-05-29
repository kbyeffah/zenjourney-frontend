import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC7iw6FZdyV2r1aIb4zPGReZD4OaDcgJtQ",
  authDomain: "imagegen-f7e27.firebaseapp.com",
  projectId: "imagegen-f7e27",
  storageBucket: "imagegen-f7e27.firebasestorage.app",
  messagingSenderId: "116743906132",
  appId: "1:116743906132:web:9c7dcee81cf4e89e4e5ec1",
  measurementId: "G-9PDC38SSWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };