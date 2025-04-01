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

    //update totalPollsVotes count locally
    const onUserVoted = () =>{
      const totalPollsVotes = user.totalPollsVotes || 0
      updateUserStats("totalPollsVotes", totalPollsVotes + 1)
    }

    //update totalPollsCreate count locally
    const onPollCreateOrDelete = (type = "create") =>{
      const totalPollsCreated = user.totalPollsCreated ||  0
      updateUserStats(
        "totalPollsCreated",
        type == "create" ? totalPollsCreated + 1 : totalPollsCreated - 1
      )
    }

    //add or remove poll id from bookmarkedPolls
    const toggleBookmarkId = (id) =>{
      const bookmarks = user.bookmarkedPolls || []

      const index = bookmarks.indexOf(id)

      if(index === -1){
        //add the id if it's not in the array
        setUser((prev) => ({
          ...prev,
          bookmarkedPolls: [...bookmarks, id],
          totalPollsBookmarked: prev.totalPollsBookmarked + 1
        }))
      } else {
        /// remove the id if its already in the array
        setUser((prev) => ({
          ...prev,
          bookmarkedPolls: bookmarks.filter((item) => item !== id),
          totalPollsBookmarked: prev.totalPollsBookmarked - 1
        }))
      }
}
  return <UserContext.Provider
  value={{
    user,
    updateUser,
    clearUser,
    onPollCreateOrDelete,
    onUserVoted,
    toggleBookmarkId
  }}>
    {children}
  </UserContext.Provider>
}

export default UserProvider