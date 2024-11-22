import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import axios from "axios";
import { ChatContext } from '../../context/ChatProvider';
function ProfileUpdate() {
  const [image,setImage]=useState();
  const [formData,setFormData]=useState({
    name:"",
    bio:""
  })
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const [prevImg,setPrevImg]=useState("");

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const {setUserData}=useContext(ChatContext)

   const [uid,setUid]=useState("")

   
      const handlePic=(images)=>{
        //setLoading(true);
        if(images===undefined){
            toast.error("Error! Something went wrong.");
        }
        else if(images.type==="image/jpg"||images.type==="image/jpeg" || images.type==="image/png"){
            const data=new FormData();
            data.append("file",images);
            data.append("upload_preset","chatApp")
            data.append("cloud_name","dduqbr4li")
            
                axios.post("https://api.cloudinary.com/v1_1/dduqbr4li/image/upload",data).
                then(res=>{
                    console.log(res.data)
                    //setFormData({...formData,image:res.data.url.toString()});
                    setPrevImg(res.data.url.toString())
                    setLoading(false);                   
                }).catch(err=>{
                    console.log(err);
                    setLoading(false);
                })
           
        }else{
            toast.error("error occured in uploading image");
            setLoading(false);
        }
      }
const profileUpdate=async(e)=>{
  e.preventDefault();
  try{
    if(!prevImg && !image){
      toast.error("upload profile image");
    }
    const docRef=doc(db,"users",uid);
    if(image){
      
      await updateDoc(docRef,{
        avatar:prevImg,
        bio:formData.bio,
        name:formData.name

      })
    }else{
      await updateDoc(docRef,{
        
        bio:formData.bio,
        name:formData.name

      })

    }
    const snap=await getDoc(docRef);
    setUserData(snap.data());
    navigate("/chat")
    toast.success("successfully profile updated");
  }catch(err){
    console.log(err);
    //toast.error(err.code.split("/")[1].split("-").join(" "))
    toast.error(err)
  }


}
    useEffect(()=>{
      onAuthStateChanged(auth,async(user)=>{
          if(user){
            setUid(user.uid);
            const docRef=doc(db,"users",user.uid);
            const docSnap=await getDoc(docRef);
            if(docSnap.data().name){
              setFormData({...formData,name:docSnap.data().name});
            }
            if(docSnap.data().bio){
              setFormData({...formData,bio:docSnap.data().bio});
            }
            if(docSnap.data().avatar){
              setPrevImg(docSnap.data().avatar);
            }
          }else{
            navigate("/")
          }
      })
    },[])


  return (
    <div className='min-h-[100vh] bg-profile-pattern bg-no-repeat bg-cover flex justify-center items-center max-md:p-[20px]'>
      <div className='bg-white md:min-w-[700px] flex justify-between items-center rounded-md max-md:w-full'>
       <form className='flex flex-col gap-[20px] p-[40px] max-md:p-[10px] max-md:w-full' onSubmit={profileUpdate}>
          <h3 className='text-lg font-bold'>Profile Page</h3>
         
          <label htmlFor='profile' className='flex items-center gap-[10px] text-gray-400 cursor-pointer ' >
          <input type='file' id="profile" onChange={(e)=>{handlePic(e.target.files[0]);setImage(e.target.files[0])}} accept='.png,.jpeg,.jpg' hidden />
            <img src={image? URL.createObjectURL(image) : assets.avatar_icon} className='h-[40px] w-[40px] object-center rounded-full' />
              upload image here
          </label>
          <input type="text" name="name" onChange={handleChange} value={formData.name} placeholder='name' className='outline-none border-2 mb-[20px] md:w-[350px] max-md:w-[100%] border-gray-300 text-md font-normal rounded-md p-2 focus:border-blue-700' />
          <textarea name="bio" value={formData.bio} onChange={handleChange}  placeholder='write your bio' className='outline-none border-2 mb-[20px] md:w-[350px] max-md:w-[100%] border-gray-300 text-md font-normal rounded-md p-2 focus:border-blue-700'></textarea>
          <button  className='w-full rounded-md text-center mb-[20px] bg-blue-600 py-2 text-white border border-blue-500'>{loading?"loading":"Submit"}</button>
       </form>
      
          <img src={image? URL.createObjectURL(image) :prevImg?prevImg:assets.logo_icon} className='max-w-[160px] aspect-square my-[20px] max-md:hidden mx-auto rounded-[50%]'/>
    
      </div>
    </div>
  )
}

export default ProfileUpdate
