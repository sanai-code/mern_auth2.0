import React, { useContext, useRef, useState } from 'react'
import {assets} from "../assets/assets"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import { ContextComp } from '../context/AppContext';
const ResetPass = () => {
  let {backendUrl} = useContext(ContextComp)
  axios.defaults.withCredentials = true
  let navigate = useNavigate();
  let [email,setEmail] = useState()
  let [newpassword,setNewPassword] = useState()
  const [isEailSent,setIsEmailSent] = useState('')
  const [otp,setOtp] = useState(0)
  const [isOtpSubmited,setIsOtpSubmited] = useState(false)
  async function  handleSubmitEmail(e) {
    try {
      e.preventDefault();
      let {data}= await axios.post(`${backendUrl}/api/auth/send-reset-otp`,{email})
      
      data.success?toast.success(data.message):toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }
  //!  otp submit function
  async function onOtpSubmit(e) {
    e.preventDefault();
      let otpArr = inputRefs.current.map((cur)=>cur.value)
      setOtp(otpArr.join(""))
      
      setIsOtpSubmited(true)
   
  }
  //! new Password submit function
  async function handleSubmitNewPass(e) {
    e.preventDefault();
    try {
      
      let {data} = await axios.post(`${backendUrl}/api/auth/reset-password`,{otp,newPassword:newpassword,email})
      data.success?navigate("/"):toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }
  let inputRefs = useRef([]);
  function handlePaste(e){
  let paste = e.clipboardData.getData('text')
  let inpArr = paste.split('')
  inpArr.forEach((cur,ind) => {
    if(inputRefs.current[ind]){
      inputRefs.current[ind].value = cur
    }
  });
  }
  function handleInput(e,ind){
    if(e.target.value.length > 0 && ind < inputRefs.current.length -1){
      inputRefs.current[ind +1].focus();
    }
  }
  function handleBackward(e,ind){
    if(e.target.value===''&& e.key==='Backspace' && ind >0){
      inputRefs.current[ind -1 ].focus();
    }
  }
  return (
    <div className='h-dvh flex items-center justify-center bg-gray-500'>
      {/* { enter email id} */}
      {!isEailSent && 
      <form className='h-full flex flex-col items-center justify-center  text-white p-8 rounded-lg shadow-lg w-96 text-sm ' onSubmit={handleSubmitEmail}>
      <h1>Reset Password</h1>
      <p className='text-center text-indigo-300'>Enter your registered email address.</p>
      <div className='flex mb-4 items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
        <img src={assets.mail_icon} alt="" />
        <input type="email" name="" id="" value={email} onChange={e=>setEmail(e.target.value)} required className='outline-none text-white'/>
      </div>
      <button className='w-full py-3 bg-blue-400 text-white rounded-full'>Submit</button>
      </form>
}

      {/* otp input form */}
  {!isOtpSubmited && isEailSent &&
      <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={e=>onOtpSubmit(e)}>
        <h1 className='text-white text-3xl'>Reset Password OTP</h1>
      <p className='text-center text-indigo-300'>Please Enter 6 digit code sent to your email id.</p>
      <div className='flex justify-between mb-8 ' onPaste={e=>handlePaste(e)}>
    {Array(6).fill(0).map((_,ind)=>{
     return <input type="text" maxLength="1" key={ind} required ref={e=>inputRefs.current[ind] = e} onInput={(e)=>handleInput(e,ind)} onKeyDown={(e)=>handleBackward(e,ind)} className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'/>
    })}
    </div>
    <button className='w-full py-3 bg-blue-400 text-white rounded-full'  type='submit'>Submit</button>
     </form>
}
     {/* enter new passwoed */}
     {isOtpSubmited && isEailSent && 
     <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm ' onSubmit={handleSubmitNewPass}>
      <h1>New Password</h1>
      <p className='text-center text-indigo-300'>Enter new password.</p>
      <div className='flex mb-4 items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
        <img src={assets.lock_icon} alt="" />
        <input type="password" name="" id="" value={newpassword} onChange={e=>setNewPassword(e.target.value)} required className='outline-none text-white' placeholder="password"/>
      </div>
      <button className='w-full py-3 bg-blue-400 text-white rounded-full'>Submit</button>
      </form>}
    </div>
  )
}

export default ResetPass;
