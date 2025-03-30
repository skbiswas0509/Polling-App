import React, { createContext, useState } from 'react'

export const UserContext = createContext()

const UserProvider = ({children}) => {
    const {user,setUser} = useState(null)

    //function to update user data
    const updateUser = (userData) => {
        setUser(userData)
    }

    //function to clear user data (e.g., on logout)
    const clearUser = () =>{
        setUser(null)
    }

    //update
    const updateUserStats = (key, value) =>{
      setUser((prev) => ({
        ...prev,
        [key]: value
      }))
    }
    //update totalPollsCreate count locally
    const onPollCreateOrDelete = (type = "create") =>{
      const totalPollsCreated = user.totalPollsCreated ||  0
      updateUserStats(
        "totalPollsCreated",
        type == "create" ? totalPollsCreated + 1 : totalPollsCreated - 1
      )
    }
  return <UserContext.Provider
  value={{
    user,
    updateUser,
    clearUser,
    onPollCreateOrDelete
  }}>
    {children}
  </UserContext.Provider>
}

export default UserProvider