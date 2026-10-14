import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBGOhnxxkVLLsiV7IbsZsSA3x93ue_u1Lc",
    authDomain: "freshpie.firebaseapp.com",
    projectId: "freshpie",
    storageBucket: "freshpie.firebasestorage.app",
    messagingSenderId: "199521322094",
    appId: "1:199521322094:web:4920ffe7dba794dc0ad27f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);