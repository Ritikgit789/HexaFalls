import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBU2C4hLQC0_ABdQj0jwjkYPHyshj93WKk",
  authDomain: "mockly-b9500.firebaseapp.com",
  projectId: "mockly-b9500",
  storageBucket: "mockly-b9500.appspot.com",
  messagingSenderId: "310497276144",
  appId: "1:310497276144:web:9b70d7b586bb7cedb7d235",
  measurementId: "G-H8LCWZCZEH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
