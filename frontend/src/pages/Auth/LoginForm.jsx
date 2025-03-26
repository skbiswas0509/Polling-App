import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate } from 'react-router-dom'
import AuthInput from '../../components/input/AuthInput'

const LoginForm = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSubmit=async()=>{

  }
  return (
    <AuthLayout>
    <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
      <h3 className='text-xl font-semibold text-black'>Welcome back</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please enter your details to login
      </p>

      <form action="" onSubmit={handleSubmit}>
        <AuthInput
        value={email}
        onChange={({target}) => setEmail(target.email)}
        label="Email Address"
        placeholder="Enter email address"
        type="text"
        />
      </form>
    </div>
    </AuthLayout>
  )
}

export default LoginForm