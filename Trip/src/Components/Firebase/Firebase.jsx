// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Add imports for authentication, database, and Firestore
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // Import Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Public-facing name for project :project-492724399931
const firebaseConfig = {
    apiKey: "AIzaSyAy-ExheqmmBDh_t0o_YfuycGV2Tvc6IbY",
    authDomain: "ai-based--trip-plan.firebaseapp.com",
    projectId: "ai-based--trip-plan",
    storageBucket: "ai-based--trip-plan.firebasestorage.app",
    messagingSenderId: "492724399931",
    appId: "1:492724399931:web:18b34b0ab25790f18c511e",
    measurementId: "G-J2Y5G7DL10",
    // databaseURL: "https://ai-based--trip-plan-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Firebase Authentication, Realtime Database, and Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
const firestore = getFirestore(app); // Changed name to lowercase

export { app, auth, provider, firestore }; // Export lowercase firestore


// request.time < timestamp.date(2025, 3, 17);