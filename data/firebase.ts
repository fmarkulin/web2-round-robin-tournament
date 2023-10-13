import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtFkdDtQ44Dt61fCi9fiSssVsVE5fGG8g",
  authDomain: "web2-round-robin.firebaseapp.com",
  projectId: "web2-round-robin",
  storageBucket: "web2-round-robin.appspot.com",
  messagingSenderId: "248429433466",
  appId: "1:248429433466:web:2e922ad5e8da7a6f95a1c3",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
if (process.env.NODE_ENV === "development") {
  console.log("development mode");
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("connected to firestore emulator");
}
