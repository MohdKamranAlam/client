// firebase-config.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // If you're using Firebase Authentication
import 'firebase/compat/firestore'; // If you're using Firestore
import { getFirestore, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAxf3cEKU0riblSO3llgX_O5VsNlDY-m8Q",
    authDomain: "aichatbot-f424a.firebaseapp.com",
    projectId: "aichatbot-f424a",
    storageBucket: "aichatbot-f424a.appspot.com",
    messagingSenderId: "430892321549",
    appId: "1:430892321549:web:d4202b0db3b518b47afe44",
    measurementId: "G-NWB98RT0K3"
};
// AIzaSyAxf3cEKU0riblSO3llgX_O5VsNlDY-m8Q
firebase.initializeApp(firebaseConfig);

 
const auth = firebase.auth()
const firestore = firebase.firestore();

export { firestore, auth, Timestamp };



