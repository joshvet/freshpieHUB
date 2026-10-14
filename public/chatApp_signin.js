import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

const HOME_PAGE = "chatApp_HomePG.html";
const form = document.getElementById("signin-form");
const errorBox = document.getElementById("error");
const btn = document.getElementById("submit-btn");

// If already logged in, skip straight to the chat
onAuthStateChanged(auth, (user) => {
    if (user) location.href = HOME_PAGE;
});

function friendlyError(e) {
    const map = {
        "auth/invalid-credential": "Wrong e-mail or password.",
        "auth/invalid-email": "Please enter a valid e-mail.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
        "auth/network-request-failed": "Network problem. Check your connection.",
        "auth/operation-not-allowed": "Email/Password sign-in isn't enabled in Firebase Console.",
    };
    return map[e.code] || e.message;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";
    btn.disabled = true;
    try {
        await signInWithEmailAndPassword(
            auth,
            document.getElementById("email").value.trim(),
            document.getElementById("password").value
        );
        // onAuthStateChanged above redirects to the home page
    } catch (err) {
        errorBox.textContent = friendlyError(err);
        btn.disabled = false;
    }
});

// "Forgot password?" sends a reset e-mail to whatever is typed in the e-mail box
document.getElementById("forgot").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    if (!email) {
        errorBox.style.color = "#dc2626";
        errorBox.textContent = "Type your e-mail above first, then click Forgot password.";
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        errorBox.style.color = "#16a34a";
        errorBox.textContent = "If that e-mail has an account, a reset link has been sent.";
    } catch (err) {
        errorBox.style.color = "#dc2626";
        errorBox.textContent = friendlyError(err);
    }
});