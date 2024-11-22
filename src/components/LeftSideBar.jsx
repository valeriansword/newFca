import React, { useContext, useEffect, useState } from 'react'
import assets from "../assets/assets.js"
import { Link } from 'react-router-dom';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db, logout } from '../config/firebase.jsx';
import { ChatContext } from '../context/ChatProvider.jsx';
import { toast } from 'react-toastify';
function LeftSideBar() {
    const [isMenu,setMenu]=useState(false);
    const {userData}=useContext(ChatContext);
    const {chatData,  messageId,setMessageId,
      chatUser,setChatUser,
      messages,setMessages,chatVisible,setChatVisible,rightSideBar,setRightSideBar}=useContext(ChatContext);

    const [user,setUser]=useState(null);
    const [showSearch,setShowSearch]=useState(false);
    const inputHandler=(e)=>{
      const input=e.target.value;
      if(input){
        setShowSearch(true)
        const userRef=collection(db,"users");
        const q=query(userRef,where("username","==",input.toLowerCase()));
       getDocs(q).then((querySnap)=>{
        if(!querySnap.empty && querySnap.docs[0].data().id !== userData.id){
         
          let userExist=false;
          chatData.map((user)=>{
            if(user.rId==querySnap.docs[0].data().id){
              userExist=true;
            }
          })
          if(!userExist){
            setUser(querySnap.docs[0].data());
          }
        
       }else{
        setUser(null)
       }}).catch(err=>{
        
        console.log(err)
       })
       
      }else{
        setShowSearch(false);
      }
           
            
    }
    const addChat=async()=>{
      const messageRef=collection(db,"messages");
      const chatsRef=collection(db,"chats");

      try{
        const newMessageRef=doc(messageRef);
        
        await setDoc(newMessageRef,{
          createdAt:serverTimestamp(),
          message:[]
        })
        await updateDoc(doc(chatsRef,user.id),{
          chatsData:arrayUnion({
            messageId:newMessageRef.id,
            lastMessage:"",
            rId:userData.id,
            updatedAt:Date.now(),
            messageSeen:true
          })
        })
        await updateDoc(doc(chatsRef,userData.id),{
          chatsData:arrayUnion({
            messageId:newMessageRef.id,
            lastMessage:"",
            rId:user.id,
            updatedAt:Date.now(),
            messageSeen:true
          })
        })

        const uSnap=await getDoc(doc(db,"users",user.id));
        const uData=uSnap.data();
        setChat({
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:user.id,
          updatedAt:Date.now(),
          messageSeen:true,
          userData:uData


        })
        setShowSearch(false);
        setChatVisible(true)

      }catch(err){
          console.log(err);
          toast.error(err.message)
      }

    }
   
    
    const setChat=async(item)=>{
    try{
      setMessageId(item.messageId);
      setChatUser(item)
      const userChatsRef=doc(db,"chats",userData.id);
      const userChatsSnapshot=await getDoc(userChatsRef);
      const userChatData=userChatsSnapshot.data();
      const chatIndex=userChatData.chatsData.findIndex((c)=>c.messageId===item.messageId);
      userChatData.chatsData[chatIndex].messageSeen=true;
      await updateDoc(userChatsRef,{
       chatsData:userChatData.chatsData
      })
      setChatVisible(true)
    }catch(err){
      console.log(err);
    }

    }
    
    
    useEffect(()=>{
      const updateChatUserData=async()=>{
        if(chatUser){
          const userRef=doc(db,"users",chatUser.userData.id);
          const userSnap=await getDoc(userRef);
          const userData=userSnap.data();
          setChatUser(prev=>({...prev,userData:userData}))

        }
      }
      updateChatUserData();
    
    },[chatData])
  return (
    <div className={`bg-[#001030] text-white max-md:min-h-[75vh] md:h-[75vh] max-md:ml-[20px] max-md:rounded-md max-md:w-full ${chatVisible || rightSideBar ?" max-md:hidden ":""}`}>
      {/* top */}
      <div className='p-[20px]'>
        {/* nav */}
        <div className='flex justify-between items-center '>
            <img src={assets.logo} className='h-[30px] max-w-[140px]' />          
            <div className={` relative py-[10px]`}  onMouseOver={()=>setMenu(true)} onMouseLeave={()=>setMenu(false)}>
              <img src={assets.menu_icon} className='h-[20px] opacity-60 cursor-pointer'/>    
               <div className={`absolute cursor-pointer ${!isMenu?" hidden ":" "} top-[100%] right-0 w-[130px] p-[20px] bg-white text-black rounded-md`}>
                <Link to="/profileUpdate"><p className=''>Edit profile</p></Link>
                <hr className='border-none h-[1px] bg-[#a4a4a4] my-[8px]'/>
                <p  onClick={()=>logout()}>Logout</p>
              </div>
            </div>       
        </div>
        {/* search */}
        <div className='mt-[20px] bg-[#002670] flex items-center space-x-[10px] py-[10px] px-[12px] '>
          <img src={assets.search_icon} className='w-[16px]'/>
          <input type='text' onChange={(e)=>inputHandler(e)} className=' bg-transparent border-none outline-none text-white text-lg placeholder-[#c8c8c8]' placeholder='search with username'/>
        </div>
      </div>
      {/* friends */}
      <div className='flex flex-col h-[70%] overflow-y-scroll'>
        {
          showSearch && user?
          <div key={user.id} onClick={()=>{addChat();setShowSearch(false)}} className='flex space-x-[20px] px-[20px] hover:bg-blue-600 hover:text-white py-[10px] items-center cursor-pointer'>
          <img src={user.avatar} className='w-[45px] h-[45px] rounded-full  object-cover'/>
          <div className='text-md '>
            <h1>{user.name}</h1>
            {/* <p className='text-sm text-[#9f9f9f] hover:text-white'>Hi,hello buddy</p> */}
          </div>
        </div>: chatData&& chatData.map((item,index)=>(
            <div onClick={()=>setChat(item)} key={index} className={`flex space-x-[20px] px-[20px] hover:bg-blue-600 hover:text-white py-[10px] items-center cursor-pointer`}>
          <img src={item.userData.avatar} className='w-[45px] h-[45px] rounded-full object-cover'/>
          <div className='text-md '>
            <h1>{item.userData.name}</h1>
            <p className={`text-sm  hover:text-white  ${item.messageSeen || item.messageId===messageId?" text-[#9f9f9f] ":" text-[#07fff3] "} `}>{item.lastMessage}</p>
          </div>
        </div>
          ))
        }
        
      </div>
    </div>
  )
}

export default LeftSideBar
