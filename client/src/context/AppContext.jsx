import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


export const ContextComp = createContext();

export const ProviderComp = (props)=>{
    axios.defaults.withCredentials = true
    let backendUrl = import.meta.env.VITE_BACKEND_URL
    let [isLoggedIn,setIsLoggedIn] = useState(false)
    let [userData,setUserData] = useState(false)
    async function getAuthStatus() {
        try {
            let {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/auth/is-auth`)
            if(data.success){
               setIsLoggedIn(true);
               getData();
            }else{
                return false
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        getAuthStatus();
    },[])
    async function getData() {
        try {
            let {data} = await axios.get(`${backendUrl}/api/user/get-details`,{ withCredentials: true })
            data.success?setUserData(data.userData):toast.error(data.message)
            
        } catch (error) {
            toast.error(error.message)
        }
    }
   let contextVal = {
    backendUrl,
    isLoggedIn,setIsLoggedIn,
    userData,setUserData,
    getData,getAuthStatus
    }

    return <ContextComp.Provider value={contextVal}>
        {props.children}
    </ContextComp.Provider>
}