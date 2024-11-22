import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../context/ChatProvider'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';

function ChatBox() {
  const {userData,setMessages,messages,messageId,setMessageId,chatUser,setChatVisible,chatVisible,rightSideBar,setRightSideBar}=useContext(ChatContext);
  const [input,setInput]=useState("");
  const sendMessage=async()=>{
    try{
      if(input && messageId){
        await updateDoc(doc(db,"messages",messageId),{
          messages:arrayUnion({
            sId:userData.id,
            text:input,
            createdAt:new Date()
          })
        })
        const userIds=[chatUser.rId,userData.id];
        userIds.forEach(async(id)=>{
          const userChatsRef=doc(db,"chats",id);
          const userChatsSnapshot=await getDoc(userChatsRef);
          if(userChatsSnapshot.exists()){
            const userChatData=userChatsSnapshot.data();
            const chatIndex=userChatData.chatsData.findIndex((c)=>c.messageId===messageId)
            userChatData.chatsData[chatIndex].lastMessage=input.slice(0,30);
            userChatData.chatsData[chatIndex].updatedAt=Date.now();
            if( userChatData.chatsData[chatIndex].rId===userData.id){
              userChatData.chatsData[chatIndex].messageSeen=false
            }
            await updateDoc(userChatsRef,{
              chatsData:userChatData.chatsData
            })
          }
        })
      }
    }catch(err){
      toast.error(err);
      console.log(err)
    }
    setInput(" ");
  }
  const convertTimeStamp=(timestamp)=>{
    let date=timestamp.toDate();
    const hour=date.getHours();
    const minute=date.getMinutes();
    if(hour>12){
      return hour-12+":"+minute+" PM"
    }else{
      return hour+":"+minute+" AM"
    }
  }
   useEffect(()=>{
    if(messageId){
      const unSub=onSnapshot(doc(db,"messages",messageId),(res)=>{
        setMessages(res.data().messages.reverse())
        console.log(res.data().messages.reverse());
      })
      return()=>{
        unSub();
      }
    }
   },[messageId])
   
  
  return chatUser?(
    <div className={`bg-[#f1f5ff] md:h-[75vh] relative max-md:h-[80vh] max-md:ml-[20px]   max-md:rounded-md max-md:w-full ${chatVisible?" max-md:w-full ":" max-md:hidden "}`}>
      {/* receiver profile */}
      <div className='px-[15px] py-[10px] flex justify-between items-center border-b border-[#c6c6c6] '>
       <div className='flex space-x-[10px] items-center'>
         <img src={chatUser.userData.avatar} onClick={()=>{setRightSideBar(true);setChatVisible(false)}} alt="" className='w-[35px] object-cover h-[35px] rounded-[50%]'/>
         <p className='flex font-bold text-lg text-[#393939] items-center ' onClick={()=>{setRightSideBar(true);setChatVisible(false)}}>{chatUser.userData.name}</p> 
         {Date.now()-chatUser.userData.lastSeen<=7000?<img src={assets.green_dot} className='h-[15px] rounded-[50%]'/>:null} 
        </div>
        <img src={assets.help_icon} className={`w-[25px] rounded-[50%] max-md:hidden`}/>
        <img src={assets.arrow_icon} onClick={()=>setChatVisible(false)} className='w-[25px] rounded-[50%] md:hidden' />
      </div>
      {/* message filed */}
      <div className='h-[calc(100%-70px)] overflow-y-scroll pb-[50px] flex flex-col-reverse'>
        {/* sender msg */}
        {
          messages.map((msg,index)=>(
            <div key={index} className={`${msg.sId===userData.id?" flex justify-end items-end space-x-[5px] px-[15px] ":" flex flex-row-reverse justify-end items-end  px-[15px] "}`}>
            <p className={`${msg.sId===userData.id?" text-white bg-[#077efe] px-[8px] max-width:[200px] text-lg font-semibold rounded-[8px] rounded-br-none mb-[30px] ":" text-white ml-[5px] bg-[#077efe] px-[8px] max-width:[200px] text-lg font-semibold rounded-[8px] rounded-bl-none mb-[30px] "}`}>{msg.text}</p>
            <div className='text-sm text-center'>
               <img src={msg.sId===userData.id?userData.avatar:chatUser.userData.avatar} className='w-[27px] h-[27px] object-cover aspect-square rounded-[50%]'/>
               <p className='text-xs font-thin'>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
          ))
        }
       
        {/* <div className='flex justify-end items-end space-x-[5px] px-[15px]'>
          <img src={assets.pic1} className='max-w-[230px] mb-[30px] rounded-[8px] rounded-br-none '/>
          <div className='text-sm text-center'>
             <img src={assets.profile_img} className='w-[27px] aspect-square rounded-[50%]'/>
             <p>2.30</p>
          </div>
        </div> */}
         {/* receiver msg */}
         {/* <div className='flex flex-row-reverse justify-end items-end  px-[15px]'>
          <p className='text-white ml-[5px] bg-[#077efe] p-[8px] max-width:[200px] text-lg font-semibold rounded-[8px] rounded-bl-none mb-[30px]'>hi, buddy</p>
          <div className='text-center text-sm'>
             <img src={chatUser.userData.avatar}  className='w-[27px] h-[27px] object-cover aspect-square rounded-full'/>
             <p>2.30</p>
          </div>
        </div> */}
      </div>
      {/* input field */}
      <div className='flex items-center space-x-[12px] absolute bottom-0 left-0 left-0 right-0 px-[15px] py-[12px] bg-white  '>
          <input type='text'  value={input} onChange={(e)=>setInput(e.target.value)} placeholder='send a message' className='outline-none flex-1'/>
          {/* <input type="file" onClick={()=>toast.info("sorry files cannot be send")} id="image" accept="image/png,image/jpeg" hidden/> */}
          <label htmlFor="image" className='flex items-center' onClick={()=>toast.info("sorry files cannot be send")}>
            <img src={assets.gallery_icon} className='w-[22px] cursor-pointer' />

          </label>
          <img src={assets.send_button} onClick={sendMessage}  className='w-[30px] cursor-pointer'/>
      </div>
    </div>
  ):<div className={`bg-white flex flex-col items-center justify-center ${chatVisible?" max-md:w-full ":" max-md:hidden "}`}>
  <img src={assets.logo_icon} className='h-[100px] w-[100px]'/>
  <p className='text-center text-xl font-semibold '>welcome,Lets start chat</p>
  
  </div>
}

export default ChatBox
