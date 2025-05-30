import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA1AVmYr_uwpQPndnvB3u2psCRgVVI7UxI",
  authDomain: "leandpages-34716.firebaseapp.com",
  projectId: "leandpages-34716",
  storageBucket: "leandpages-34716.firebasestorage.app",
  messagingSenderId: "894386449102",
  appId: "1:894386449102:web:e73da165e2139a94ee3e9f",
  measurementId: "G-Q20SLJ5J6D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); 