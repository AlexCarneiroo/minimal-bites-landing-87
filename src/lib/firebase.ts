import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2k0WSfKmk2Ta2OrQTQ9yU1vPts5QywXc",
  authDomain: "leandpages.firebaseapp.com",
  projectId: "leandpages",
  storageBucket: "leandpages.firebasestorage.app",
  messagingSenderId: "125625473745",
  appId: "1:125625473745:web:1703fcdb578ce4938203f0",
  measurementId: "G-4TD5QFLKSX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); 