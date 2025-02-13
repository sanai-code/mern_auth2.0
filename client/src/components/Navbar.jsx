import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ContextComp } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Login from '../pages/Login'
const Navbar = () => {
  let {userData,setIsLoggedIn,setUserData} = useContext(ContextComp)
    const navigate = useNavigate()
    async function sendVerificationOtp() {
      try {
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-verify-otp`)
        if(data.success){
          navigate("/email-verify")
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    async function  handlefilesubmit(e) {
      e.preventDefault();
      let response = await axios.post('http://localhost:8000/api/v1/upload')
    }
  
  return (
    <div className='w-full h-[100vh] bg-teal-300 flex justify-between items-center p-4 sm:p-6 px-24 absolute top-0'>
      <Login/>
     <div></div>
      {
        userData?<div className='bg-amber-200 h-10 w-10 rounded-full flex items-center justify-center relative group'>
    
         {userData.name[0].toUpperCase()}
         <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 w-30'>
            <ul>
              {!userData.isVerified && <li onClick={sendVerificationOtp}>Verify Email</li>}
              
              <li onClick={()=>logout()}>Log out</li>
            </ul>
         </div>
        </div>:

      <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 hover:bg-gray-100' onClick={()=>navigate('/login')}>Login <img src={assets.arrow_icon} alt="" /></button>
      }
      <form onSubmit={handlefilesubmit} >
        <input type="file" placeholder='choose file' name='image'/>
        <button type='submit'>submit</button>
      </form>
    </div>
  )
}

export default Navbar
