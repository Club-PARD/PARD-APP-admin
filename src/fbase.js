import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyArT5Wdakh1mXAi8ygFaK7yaYe4qupec7Q",
    authDomain: "pard-app-project.firebaseapp.com",
    projectId: "pard-app-project",
    storageBucket: "pard-app-project.appspot.com",
    messagingSenderId: "676828935630",
    appId: "1:676828935630:web:c4a080e673a7d53f05a79f",
    measurementId: "G-41DDFKX08T"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const dbService = getFirestore(app); //  firebase DB => DB를 관리
const auth = getAuth(app);

export { app, dbService, analytics, auth };
