import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';

export const ChatContext=createContext();

function ChatProvider({children}) {
    const navigate=useNavigate();
    
    const [userData,setUserData]=useState(null);
    const [chatData,setChatData]=useState(null);
    const [messageId,setMessageId]=useState(null);
    const [messages,setMessages]=useState([]);
    const [chatUser,setChatUser]=useState(null);
    const [chatVisible,setChatVisible]=useState(false);
    const [rightSideBar,setRightSideBar]=useState(false);
    const loadUserData=async(uid)=>{
        try{
            const userRef=doc(db,"users",uid);
            const userSnap=await getDoc(userRef);
            const userData=userSnap.data();
            setUserData(userData);
            if(userData.name && userData.avatar){
                navigate("/chat")
            }else{
                navigate("/profileUpdate")
            }
            await updateDoc(userRef,{
                lastSeen:Date.now()
            })

            setInterval(async()=>{
                await updateDoc(userRef,{
                    lastSeen:Date.now()
                })
            },6000)  

            console.log(userData);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        onAuthStateChanged(auth,async(user)=>{
          if(user){
            navigate("/chat");
            await loadUserData(user.uid);
            console.log(user)
          }else{
            navigate("/")
          }
        })
      },[])
      useEffect(()=>{
        if(userData){
            const chatRef=doc(db,"chats",userData.id);
            const unsub=onSnapshot(chatRef,async(res)=>{
                const chatItems=res.data().chatsData;
                const tempData=[];
                for(const item of chatItems){
                    const userRef=doc(db,"users",item.rId);
                    const userSnap=await getDoc(userRef);
                    const userData=userSnap.data();
                    tempData.push({...item,userData});
                }
                setChatData(tempData.sort((a,b)=>b.updatedAt-a.updatedAt))
            })
            return ()=>{
                    unsub();
            }
        }
      },[userData])
    const value={
        userData,  setUserData,
        setChatData,chatData,
        loadUserData,
        messageId,setMessageId,
        chatUser,setChatUser,
        messages,setMessages,
        chatVisible,setChatVisible,
        rightSideBar,setRightSideBar

    }
  return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
