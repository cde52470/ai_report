//嚴禁去問chatgpt 後面的鑰使號會洩漏我的身分的疑慮!!!!!!

// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJGUhR7Hv5Vm3VRSd-Q1R70RGBF1TcgQI",
  authDomain: "sharedppt-b6fde.firebaseapp.com",
  projectId: "sharedppt-b6fde",
  storageBucket: "sharedppt-b6fde.firebasestorage.app",
  messagingSenderId: "89964733754",
  appId: "1:89964733754:web:76a7601a93791fbd8c5c03",
  measurementId: "G-YWGFJT0RJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 匯出 Firebase Authentication & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);