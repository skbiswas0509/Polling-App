import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import ProfilePicSelector from '../../components/input/ProfilePicSelector'
import AuthInput from '../../components/input/AuthInput'
import { validateEmail } from '../../utils/helper'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import uploadImage from '../../utils/uploadImage'

const SignUpForm = () => {

  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState(null)

  const {updateUser} = useContext(UserContext)

  const navigate = useNavigate()

  //handle sign up form
  //  submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    let profileImageUrl = ""

    if(!fullName){
      setError("Please enter the full name")
      return
    }

    if(!validateEmail){
      setError("Please enter a valid email address")
      return
    }

    if(!username){
      setError("Please enter the username")
      return
    }

  if(!password){
    setError("Please enter the password")
    return
  }

  setError("")

  try {
    //upload image if present
    if(profilePic){
      const imgUploadRes = await uploadImage(profilePic)
      profileImageUrl = imgUploadRes.imageUrl || ""
    }
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      fullName,
      username,
      email,
      password,
      profileImageUrl
    })

    const {token, user } = response.data

    if(token){
      localStorage.setItem("token", token)
      updateUser(user)
      navigate("/dashboard")
    }
  //signup api  
  } catch (error) {
    if(error.response && error.response.data.message){
      setError(error.response.data.message)
    }else{
      setError("Something went wrong. Please try again")
    }
  }
  }
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create An Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by filling up you details below
        </p>

        <form action="" onSubmit={handleSubmit}>
          <ProfilePicSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

            <AuthInput
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full name"
              placeholder="Enter your Fullname"
              type="text"
            />

            <AuthInput
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="Enter email address"
              type="text"
            />

            <AuthInput
              value={username}
              onChange={({ target }) => setPassword(target.value)}
              label="Username"
              placeholder="@"
              type="text"
            />

            <AuthInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Enter Password"
              type="password"
            />
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            Create Account
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link className='font-medium text-primary underline' to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUpForm