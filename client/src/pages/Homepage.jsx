import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { ContextComp } from "../context/AppContext";
import Login from "./Login";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Homepage = () => {
  const { userData, isLoggedIn,setIsLoggedIn ,setUserData} = useContext(ContextComp);
  const navigate = useNavigate();

  async function logout(){
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`)
      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate("/")
    } catch (error) {
      toast.error(error.message)
    }
}
  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800 gap-5 relative">
          <button className="absolute top-0 right-5 border px-4 py-2 rounded-full cursor-pointer md:right-20" onClick={()=>logout()}>Log out</button>
          <img
            src={"./src/assets/Porsche_Desktop.jpeg"}
            alt=""
            className="rounded-full w-36 h-36 mb-6 object-cover"
          />
          <h1 className="flex items-center gap-2 sm:text-3xl font-medium mb-2">
            Hey {userData ? userData.name : ""}
          </h1>
          <h2>Welcome to our app</h2>
          <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
            Get Started
          </button>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};
