import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyC4QkvmUUzdtXb3dYO1m4iIXe61-fr4IdY",
    authDomain: "todo-c911a.firebaseapp.com",
    databaseURL: "https://todo-c911a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "todo-c911a",
    storageBucket: "todo-c911a.appspot.com",
    messagingSenderId: "699996723226",
    appId: "1:699996723226:web:df7ee983c63a304bf799a3",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);