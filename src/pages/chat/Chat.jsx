import React, { useContext, useEffect, useState } from 'react'
import "./Chat.css"
import LeftSideBar from '../../components/LeftSideBar'
import ChatBox from '../../components/ChatBox'
import RightSideBar from '../../components/RightSideBar'
import { ChatContext } from '../../context/ChatProvider'
function Chat() {
  const [loading,setLoading]=useState(true);
  const{userData,chatData}=useContext(ChatContext);
  useEffect(()=>{
    if(chatData && userData){
        setLoading(false);
    }
  },[chatData,userData])
  return (
    <div className='chat min-h-screen md:grid place-content-center'>
      {
        loading?<p className='text-white text-3xl font-semibold max-md:text-center'>Loading...</p>:
        <div className='w-[95%] h-[75vh] max-w-[1000px] grid grid-cols-[1fr_2fr_1fr] max-md:flex max-md:min-h-[90vh]'>
        <LeftSideBar />
        <ChatBox />
        <RightSideBar />
       </div>
      }
     
    </div>
  )
}

export default Chat
