import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdoNL9nwc31gujQp5X6sZkeYHorBcUxAg",
  authDomain: "finstamiles-app.firebaseapp.com",
  projectId: "finstamiles-app",
  storageBucket: "finstamiles-app.appspot.com",
  messagingSenderId: "257106489039",
  appId: "1:257106489039:web:78831c58c098e9ca91d1ba",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
