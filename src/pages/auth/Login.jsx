import React, { useState } from 'react'
import "./Login.css"
import assets from "../../assets/assets.js"
import { login, resetPass, signUp } from '../../config/firebase.jsx';
import { toast } from 'react-toastify';
function Login() {
    const [curState,setCurState]=useState("Sign Up");
    const [formData,setFormData]=useState({
        email:"",
        name:"",
        password:"",
    })

    const handleChange=(e)=>{
            setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(curState==="Sign Up"){
            if(!formData.name || !formData.email || !formData.password ){
                toast.error("please fill all the field");
                return;
            }
        }else{
            if( !formData.email || !formData.password ){
                toast.error("please fill all the field");
                return;
            }
        }
       
        if(curState==="Sign Up"){
            signUp(formData.name,formData.email,formData.password)
        }else{
            login(formData.email,formData.password)
            console.log("user logged in")
        }
    }
  return (
    <div className='login h-screen flex justify-center items-center '>
  
      {/* auth components */}
        <div className='bg-white rounded-md p-4 max-sm:w-[90%]'>
        <form className='flex flex-col' onSubmit={handleSubmit}>
            <h1 className='text-2xl font-semibold mb-[20px]'>{curState}</h1>
            
               {curState==="Sign Up"? <input type='text' name="name"value={formData.name} onChange={handleChange} placeholder='Username' required className='outline-none border-2 mb-[20px] w-[350px] border-gray-300 text-md font-normal rounded-md p-2 focus:border-blue-700 max-sm:w-full'/> :null               } 
            
                <input type='email' placeholder='Email' name="email" value={formData.email} onChange={handleChange} required className=' max-sm:w-full outline-none border-2 mb-[20px] w-[350px] border-gray-300 text-md font-normal rounded-md p-2 focus:border-blue-700'/>                
            
                <input type='password' placeholder='Password' required value={formData.password} onChange={handleChange}  name="password" className=' max-sm:w-full outline-none border-2 mb-[20px] w-[350px] border-gray-300 text-md font-normal rounded-md p-2 focus:border-blue-700'/>                
            
            <button className='w-full rounded-md text-center mb-[20px] bg-blue-600 py-2 text-white border border-blue-500'>{curState==="Sign Up"?"Create Account":"Login"}</button>
            <div className='flex space-x-2 mb-[20px] items-center'>
                <input type='checkbox' required/>
                <p>Agree to the terms and conditions</p>
            </div>
          
                {
                    curState==="Sign Up"?(
                        <div className='flex space-x-2'>
                             <p>Already have an account? </p>
                            <p className='text-blue-600 cursor-pointer' onClick={()=>setCurState("Login")}>Login Here</p>
                        </div>
                    )
                       
                    :(
                        <div className='flex space-x-2'>
                             <p>Dont have an account? </p>
                            <p className='text-blue-600 cursor-pointer' onClick={()=>setCurState("Sign Up")}>Sign Up</p>
                        </div>
                    )

                    
                }
                {
                    curState==="Login"?
                    <div className='flex space-x-2'>
                             <p>Forgot Password ?</p>
                            <p className='text-blue-600 cursor-pointer' onClick={()=>resetPass(formData.email)}>Rest here</p>
                        </div>:null
                }
                        
           
        </form>
        </div>
    </div>
  )
}

export default Login
