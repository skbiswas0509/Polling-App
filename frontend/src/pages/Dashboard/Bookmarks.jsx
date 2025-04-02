import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import PollCard from '../../components/PollCards/PollCard'
import BOOKMARK_ICON from "../../assets/images/bookmark-icon.png"
import EmptyCard from '../../components/cards/EmptyCard'
import { UserContext } from '../../context/UserContext'

const loadMorePolls = ()=>{
  setPage((prevPage) => prevPage + 1)
}


const Bookmarks = () => {

  useUserAuth()

  const navigate = useNavigate()
  const {user} = useContext(UserContext)

  const [votedPolls, setVotedPolls] = useState([])
  const [bookmarkedPolls, setBookmarkedPolls] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllPolls =async() =>{
    if(loading) return
    
    setLoading(true)

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BOOKMARKED)

      if(response.data?.bookmarkedPolls?.lenght > 0){
        setBookmarkedPolls((prevPolls) => [...prevPolls, ...response.data.bookmarkedPolls]) 

      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(()=>{
      fetchAllPolls()
    return () =>{}
  },[])

  return (
    <DashboardLayout activeMenu='Bookmarks'>
    <div className='my-5 mx-auto'>
      <h2 className='text-xl font-medium text-black'>Bookmarks</h2>


      {bookmarkedPolls.length === 0 && !loading &&(
        <EmptyCard
        imgSrc={BOOKMARK_ICON}
        message="You have not voted on any polls yet. start exploring and share your thoughts"
        btnText="Explore"
        onClick={() => navigate("/dashboard")}
        />
      )}
      
      
      {bookmarkedPolls.map((poll) => {
        if(!user?.bookmarkedPolls?.includes(poll._id)) return null

        return (
        <PollCard
        key={`dashboard_${poll._id}`}
        pollId={poll._id}
        question={poll.question}
        type={poll.type}
        options={poll.options}
        votes={poll.voters.length || 0}
        responses={poll.responses || []}
        creatorProfileImg={poll.creator.profileImgUrl || null}
        creatorName={poll.creator.fullName}
        creatorUsername={poll.creator.username}
        userHasMore={poll.creator.username}
        userHasVoted={poll.userHasVoted || false}
        isPollClose={poll.closed || false}
        createdAt={poll.createdAt || false}
        />
        )
      })}
    </div>
    </DashboardLayout>
  )
}

export default Bookmarks