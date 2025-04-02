import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import PollCard from '../../components/PollCards/PollCard'
import CREATE_ICON from "../../assets/images/my-poll-icon.png"
import EmptyCard from '../../components/cards/EmptyCard'

const loadMorePolls = ()=>{
  setPage((prevPage) => prevPage + 1)
}

const VotedPolls = () => {

  useUserAuth()

  const navigate = useNavigate()

  const [votedPolls, setVotedPolls] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllPolls =async() =>{
    if(loading) return
    
    setLoading(true)

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.VOTED_POLLS)

      if(response.data?.polls?.lenght > 0){
        setVotedPolls((prevPolls) => [...prevPolls, ...response.data.polls])
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPolls()
    return () => {}
  },[])


  return (
    <DashboardLayout activeMenu='Voted Polls'>
    <div className='my-5 mx-auto'>
      <h2 className='text-xl font-medium text-black'>Voted Polls</h2>


      {votedPolls.length === 0 && !loading &&(
        <EmptyCard
        imgSrc={CREATE_ICON}
        message="You have not voted on any polls yet. start exploring and share your thoughts"
        btnText="Explore"
        onClick={() => navigate("/dashboard")}
        />
      )}
     
      {votedPolls.map((poll) => (
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
      ))}
    </div>
    </DashboardLayout>
  )
}

export default VotedPolls