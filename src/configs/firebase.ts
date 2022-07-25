import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import 'firebase/compat/auth'

const clientCredentials = {
    apiKey: process.env.NEXT_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(clientCredentials)
console.log("Firebase initialized...")

export const firedb = getFirestore(firebaseApp);
console.log("Firebase-Firestore initialized...")

export const fireStorage = getStorage(firebaseApp)
console.log("Firebase-Storage initialized...")