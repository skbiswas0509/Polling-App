import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from '../../components/input/AuthInput'
import { validateEmail } from '../../utils/helper'

const LoginForm = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  //handle login form submit
  const handleLogin=async(e)=>{
    e.preventDefault()

    if(!validateEmail(email)){
      setError("Please enter a valid email address")
      return
    }

    if(!password){
      setError("Please enter the password")
      return
    }

    setError("")

    //login api 
    try {
      
    } catch (error) {
      
    }
  }
  return (
    <AuthLayout>
    <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
      <h3 className='text-xl font-semibold text-black'>Welcome back</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please enter your details to login
      </p>

      <form action="" onSubmit={handleLogin}>
        <AuthInput
        value={email}
        onChange={({target}) => setEmail(target.value)}
        label="Email Address"
        placeholder="Enter email address"
        type="text"
        />

        <AuthInput
        value={password}
        onChange={({target})=>setPassword(target.value)}
        label="Password"
        placeholder="Enter Password"
        type="password"
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          Login
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          Dont have an account?{" "}
          <Link className='font-medium text-primary underline' to="/signup">
          Signup
          </Link>
        </p>

      </form>
    </div>
    </AuthLayout>
  )
}

export default LoginForm