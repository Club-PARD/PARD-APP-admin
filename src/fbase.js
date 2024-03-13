import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  }

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const dbService = getFirestore(app); //  firebase DB => DB를 관리
const auth = getAuth(app);


export const fetchDataFromFirebase = async () => {
  try {
    const snapshot = await dbService.collection('yourCollection').get(); // Firestore 컬렉션에서 데이터 가져오기
    const data = snapshot.docs.map(doc => doc.data()); // 가져온 데이터 맵핑
    return data;
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

export { app, dbService, analytics, auth };


