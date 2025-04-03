import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Firebase Config:", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("Firebase initialized successfully.");

// Test Firestore connection
const testFirestore = async () => {
  try {
    const docRef = doc(db, "test", "testDoc");
    await setDoc(docRef, { test: "hello" });
    console.log("Écriture Firestore réussie !");
    
    const docSnap = await getDoc(docRef);
    console.log("Données Firestore :", docSnap.data());
  } catch (error) {
    console.error("Erreur Firestore :", error);
  }
};

testFirestore();