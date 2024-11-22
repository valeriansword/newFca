// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import {createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chat-app-ca7f8.firebaseapp.com",
  projectId: "chat-app-ca7f8",
  storageBucket: "chat-app-ca7f8.firebasestorage.app",
  messagingSenderId: "641286088464",
  appId: "1:641286088464:web:cfc477bcd522bc755de795",
  measurementId: "G-YTZ6QTTVCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth=getAuth(app);
const db=getFirestore(app);

const signUp=async(username,email,password)=>{
  try{
    const res=await createUserWithEmailAndPassword(auth,email,password);
    const user=res.user;
    await setDoc(doc(db,"users",user.uid),{
      id:user.uid,
      username:username.toLowerCase(),
      email,
      name:"",
      avatar:"",
      bio:"Hey,There I am using chat app",
      lastSeen:Date.now()
    })
    await setDoc(doc(db,"chats",user.uid),{
      chatsData:[]
    })
  }catch(err){
    console.log(err);
    toast.error(err.code.split("/")[1].split("-").join(" "))
  }
}

const login=async(email,password)=>{
    try{
      await signInWithEmailAndPassword(auth,email,password);
      toast.success("user logged in")
    }catch(err){
      console.log(err);
      toast.error(err.code.split("/")[1].split("-").join(" "))
    }
}
const logout=async()=>{
  try{
    await signOut(auth);
    toast.success("logout successfully");
  }catch(err){
    console.log(err.code);
    toast.error(err.code.split("/")[1].split("-").join(" "))
  
  }
}
const resetPass=async(email)=>{
  if(!email){
    toast.error("enter your email");
    return null;
  }
  try{
    const userRef=collection(db,"users");
    const q=query(userRef,where("email","==",email));
    const querySnap=await getDocs(q);
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset link sent to your email");

    }else{
      toast.error("email doesnt exist");

    }
  }catch(err){
    console.log(err);
    toast.error(err.message);
  }
}
export {signUp,login,logout,auth,db,resetPass}
