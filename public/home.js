import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp }
    from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const SIGNIN_PAGE = "index.html";
const box = document.getElementById("messages");

onAuthStateChanged(auth, (user) => {
    if (!user) return (location.href = SIGNIN_PAGE);   // not logged in -> back to sign in
    document.getElementById("whoami").textContent = user.displayName || user.email;

    // Live listener: newest 100 messages, shown oldest -> newest
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(100));
    onSnapshot(q, (snap) => {
        const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;

        if (snap.empty) {
            box.innerHTML = '<p class="empty">No messages yet. Say hi!</p>';
            return;
        }

        box.replaceChildren(...snap.docs.reverse().map((d) => {
            const m = d.data({ serverTimestamps: "estimate" });
            const mine = m.authorId === user.uid;

            const row = document.createElement("div");
            row.className = "msg " + (mine ? "mine" : "theirs");

            const name = document.createElement("span");
            name.className = "msg-name";
            name.textContent = mine ? "You" : m.authorName;

            const text = document.createElement("div");
            text.className = "bubble";
            text.textContent = m.text;          // textContent = safe from HTML injection

            row.append(name, text);
            return row;
        }));

        if (nearBottom || snap.metadata.hasPendingWrites) box.scrollTop = box.scrollHeight;
    }, (err) => {
        box.textContent = "Could not load messages: " + err.message;
        console.error(err);
    });
});

document.getElementById("chat-form").onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById("msg-input");
    const text = input.value.trim();
    if (!text) return;
    try {
        await addDoc(collection(db, "messages"), {
            text,
            authorId: auth.currentUser.uid,
            authorName: auth.currentUser.displayName || "Anonymous",
            createdAt: serverTimestamp(),
        });
        input.value = "";
    } catch (err) {
        alert("Could not send: " + err.message);
        console.error(err);
    }
};

document.getElementById("logout").onclick = () =>
    signOut(auth).then(() => (location.href = SIGNIN_PAGE));