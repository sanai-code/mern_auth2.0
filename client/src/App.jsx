import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPass from './pages/ResetPass'
import { ToastContainer } from 'react-toastify';
import {Homepage} from './pages/Homepage'
const App = () => {
  return (
    <div className='text'>
      <ToastContainer/>
    <Routes>
    <Route path='/' element={<Homepage/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/email-verify' element={<EmailVerify/>}/>
    <Route path='/reset-password' element={<ResetPass/>}/>
    </Routes>
    </div>
  )
}

export default App

