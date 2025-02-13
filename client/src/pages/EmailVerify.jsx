import axios from 'axios';
import React, { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ContextComp } from '../context/AppContext';

const EmailVerify = () => {
  let {getData,backendUrl} = useContext(ContextComp)
  let inputRefs = useRef([]);
  let navigate = useNavigate();
  function handleInput(e,ind){
    if(e.target.value.length > 0 && ind < inputRefs.current.length -1){
      inputRefs.current[ind +1].focus();
    }
  }

  function handleBackward(e,ind){
    if(e.key==='Backspace' && e.target.value === "" && ind >0){
      inputRefs.current[ind -1].focus();
    }
  }
  function handlePaste(e){
    let paste = e.clipboardData.getData('text')
    
    let splitdata = paste.split("")
    splitdata.forEach((elem,ind )=> {
      if(inputRefs.current[ind]){
        inputRefs.current[ind].value = elem
      }})
    };
    
    async function onSummitHandler(e) {
      axios.defaults.withCredentials = true
      try {
        e.preventDefault();
        const otpArr = inputRefs.current.map((cur)=>cur.value)
        let otp = otpArr.join("")
        let res = await axios.post(`${backendUrl}/api/auth/verify-account`,{otp})
        if(res.success){
          toast.success(res.message)
          getData();
          navigate("/")
        }else{
          toast.error(res.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  
  return (
    <div className='text-white h-[100vh] w-full' >
     <form className=' h-full  bg-slate-900 p-8 rounded-lg shadow-lg w-full text-sm' onSubmit={e=>onSummitHandler(e)}>
      <h1>Email Verify OTP</h1>
    <p className='text-center text-indigo-300'>Please Enter 6 digit code sent to your email id.</p>
    <div className='flex justify-between mb-8 ' onPaste={e=>handlePaste(e)}>
    {Array(6).fill(0).map((_,ind)=>{
     return <input type="text" maxLength="1" key={ind} required ref={e=>inputRefs.current[ind] = e} onInput={(e)=>handleInput(e,ind)} onKeyDown={(e)=>handleBackward(e,ind)} className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'/>
    })}
    </div>
    <button className='w-full py-3 bg-blue-400 text-white rounded-full'  type='submit'>Verify Email</button>
     </form>
    </div>
  )
}

export default EmailVerify
