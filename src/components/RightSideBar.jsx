import React, { useContext } from 'react'
import assets from '../assets/assets'
import { logout } from '../config/firebase'
import { ChatContext } from '../context/ChatProvider'

function RightSideBar() {
  const {userData,chatUser,messages,rightSideBar,setRightSideBar,setChatVisible }=useContext(ChatContext);

  return chatUser? (
    <div className={`bg-[#001030] relative overflow-y-scroll text-white h-[75vh] max-md:h-[80vh]  max-md:ml-[20px] max-md:rounded-md max-md:w-full  ${!rightSideBar?" max-md:hidden ":""}`}>
      {/* profile */}
      <img src={assets.arrow_icon} onClick={()=>{setRightSideBar(false);setChatVisible(true) }} className='w-[25px] bg-white absolute right-[10px] top-[10px] p-[5px] rounded-[50%] md:hidden' />
      <div className='pt-[60px] text-center flex flex-col items-center mb-[10px] '>
          <img src={chatUser.userData.avatar} className='aspect-square object-cover w-[110px] rounded-[50%]'/>
          <div className='flex items-center space-x-[5px]'>
            <p className='flex font-bold text-lg  items-center '>{chatUser.userData.name}</p> 
            {Date.now()-chatUser.userData.lastSeen<=7000?<img src={assets.green_dot} className='h-[15px] rounded-[50%]'/>:null} 
          </div>      
          <p className='text-sm opacity-80 font-semibold'>{chatUser.userData.bio}</p>
      </div>
      <hr  className='h-[1px] border border-[#ffffff50] my-[15px]'/>
      {/* media */}
      <div className='px-[20px] '>
        <p>Media</p>
        <div className='max-h-[180px] overflow-y-scroll grid grid-cols-[1fr_1fr_1fr] gap-[5px] mt-[8px]'>
          <img src={assets.pic1} className='w-[60px] rounded-[4px] cursor-pointer' />
          <img src={assets.pic2} className='w-[60px] rounded-[4px] cursor-pointer' />
          <img src={assets.pic3} className='w-[60px] rounded-[4px] cursor-pointer' />
          <img src={assets.pic4} className='w-[60px] rounded-[4px] cursor-pointer' />
          <img src={assets.pic1} className='w-[60px] rounded-[4px] cursor-pointer' />
          <img src={assets.pic2} className='w-[60px] rounded-[4px] cursor-pointer' />
        </div>
      </div>
      {/* logout */}
      <button className='absolute bottom-0 left-0 right-0  cursor-pointer py-[5px] m-[10px] text-center text-lg rounded-[30px] bg-blue-500' onClick={()=>logout()}>Log out</button>
    </div>
  ):<div className='bg-[#001030] relative overflow-y-scroll text-white h-[75vh] max-md:hidden'>
    <button className='absolute bottom-0 left-0 right-0  cursor-pointer py-[5px] m-[10px] text-center text-lg rounded-[30px] bg-blue-500' onClick={()=>logout()}>Log out</button>
  </div>
}

export default RightSideBar
