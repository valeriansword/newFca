import { useContext, useEffect, useState } from 'react'
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import Login from './pages/auth/Login';
import ProfileUpdate from './pages/profile/ProfileUpdate';
import Chat from './pages/chat/Chat';
import "./App.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import ChatProvider, { ChatContext } from './context/ChatProvider';
function App() {
  const [count, setCount] = useState(0)
 
  return (
 
     <BrowserRouter>
     <ChatProvider>
     <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/chat" element={<Chat />}/>
        <Route path="/profileUpdate" element={<ProfileUpdate />}/>
      </Routes>
      </ChatProvider>
     </BrowserRouter>
    
  )
}

export default App
