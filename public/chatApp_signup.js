import { createUserWithEmailAndPassword, updateProfile }
    from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp }
    from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const form = document.getElementById("signup-form");
const errorBox = document.getElementById("error");
const btn = document.getElementById("submit-btn");

function friendlyError(e) {
    const map = {
        "auth/email-already-in-use": "That e-mail is already registered.",
        "auth/invalid-email": "Please enter a valid e-mail.",
        "auth/weak-password": "Password is too weak.",
        "auth/network-request-failed": "Network problem. Check your connection.",
        "auth/operation-not-allowed": "Email/Password sign-in isn't enabled in Firebase Console.",
    };
    return map[e.code] || e.message;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
        errorBox.textContent = "Passwords don't match.";
        return;
    }

    btn.disabled = true;
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(db, "users", cred.user.uid), {
            fullName: name,
            email,
            createdAt: serverTimestamp(),
        });
        location.href = "chatApp_HomePG.html";   // change to your real home page file name
    } catch (err) {
        errorBox.textContent = friendlyError(err);
        btn.disabled = false;
    }
});