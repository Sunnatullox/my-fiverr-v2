import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDri2xchluHrOpF0KHovnrZI28UDzbUwcE",
  authDomain: "fiverr-clone-ff2df.firebaseapp.com",
  projectId: "fiverr-clone-ff2df",
  storageBucket: "fiverr-clone-ff2df.appspot.com",
  messagingSenderId: "331248933722",
  appId: "1:331248933722:web:efdafe1f49f30f9b267163",
  measurementId: "G-XCSCYFHSZE"
};

const app = initializeApp(firebaseConfig);
// export const firebaseAuth = getAuth(app);
export const storage = getStorage(app);
