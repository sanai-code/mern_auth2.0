import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ContextComp } from "../context/AppContext";
import { toast } from "react-toastify";const Login = () => {
  let navigate = useNavigate();
  let {getData,backendUrl, setIsLoggedIn } = useContext(ContextComp);
  let [state, setState] = useState("Sign Up");
  const [prev, setName] = useState({
    name: "",
    email: "",
    password: "",
  });
  function handleChange(e) {
    let name = e.target.name;
    let targetVal = e.target.value;
    setName({ ...prev, [name]: targetVal });
  }
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        let { data } = await axios.post(
          `${backendUrl}/api/auth/register`,
          prev
        );
        if (data.success) {
          toast.success('signup successfull')
          setIsLoggedIn(true);
          getData()
          // navigate("/home")
          
        } else {
          toast.error(data.message);
        }
      } else {
        let { data } = await axios.post(`${backendUrl}/api/auth/login`, prev);
        if (data.success) {
          toast.success('login successfull')
          setIsLoggedIn(true);
          getData()
          // navigate("/home");
        } else {
          // toast.error(data.message);
          return null
        }
      }
    } catch (error) {
      toast.error(data.message);
    }
  }
  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gray-600">
      <div id="wrapper" className="w-full h-fit md:w-2/6">
      <div className="bg-slate-400 h-full w-full p-10 rounded-lg flex flex-col gap-5">
        <h2 className="text-3xl">
          {state === "Sign Up" ? "Create account" : "Log in"}
        </h2>
        <form onSubmit={(e) => handleSubmit(e)} className="text-white" encType="multipart/form-data">
          {state === "Sign Up" && (
            <>
              <div className="flex mb-4 items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
                <img src={assets.person_icon} alt="" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="outline-none bg-transparent"
                  name="name"
                  onChange={(e) => handleChange(e)}
                  value={prev.name}
                />
              </div>
            </>
          )}

          <div className="flex mb-4 items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email Id"
              required
              className="outline-none bg-transparent"
              name="email"
              onChange={(e) => handleChange(e)}
              value={prev.email}
            />
          </div>
          <div className="flex mb-4 items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              className="outline-none bg-transparent"
              name="password"
              onChange={(e) => handleChange(e)}
              value={prev.password}
            />
          </div>
          
          <p
            onClick={() => navigate("/reset-password")}
            className="text-white underline m-3"
          >
            Forget password
          </p>
          <button className="rounded-full w-full  py-3 bg-blue-400">
            {state}
          </button>
        </form>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              className="underline text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              {"  "}login here
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span
              className="underline text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              {"  "}signup here
            </span>
          </p>
        )}
      </div>


      </div>
      
    </div>
  );
};

export default Login;
