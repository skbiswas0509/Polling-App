import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import HeaderWithFilter from '../../components/layouts/HeaderWithFilter'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import PollCard from '../../components/PollCards/PollCard'

import InfiniteScroll from 'react-infinite-scroll-component'
import { UserContext } from '../../context/UserContext'
import EmptyCard from '../../components/cards/EmptyCard'
import CREATE_ICON from "../../assets/images/my-poll-icon.png"


const loadMorePolls = ()=>{
  setPage((prevPage) => prevPage + 1)
}

const PAGE_SIZE = 10 

const MyPoll = () => {

  useUserAuth()

  const {user} = useContext(UserContext)
  const navigate = useNavigate()

  const [allPolls, setAllPolls] = useState([])
  const [stats, setStats] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const [filterType, setFilterType] = useState("")

  const fetchAllPolls =async(overridgePage  =page) =>{
    if(loading) return
    
    setLoading(true)

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?pages=${overridgePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      )

      if(response.data?.polls?.lenght > 0){
        setAllPolls((prevPolls) =>
        overridgePage ===1
          ? response.data.polls
          : [...prevPolls, ...response.data.polls]
        ) 
        setStats(response.data?.stats || [])
        setHasMore(response.data.polls.length === PAGE_SIZE)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    setPage(1)
    fetchAllPolls(1)
    return () =>{}
  },[filterType])

  useEffect(()=>{
    if(page !== 1){
      fetchAllPolls()
    }
    return () =>{}
  },[page])

  return (
    <DashboardLayout activeMenu='My Poll'>
    <div className='my-5 mx-auto'>
      <HeaderWithFilter 
      title="My Polls"
      filterType={filterType}
      setFilterType={setFilterType}
      />

      {allPolls.length === 0 && !loading &&(
        <EmptyCard 
        imgSrc={CREATE_ICON}
        message="Welcome. You are the first user of the system and therefore there no polls in the system."
        btnText="Create Poll"
        onClick={() => navigate("/create-poll")}
        />
      )}

      <InfiniteScroll 
      dataLength={allPolls.length}
      next={loadMorePolls}
      hasMore={hasMore}
      loader={<h4 className='info-text'>Loading</h4>}
      endMessage={<p className='info-text'>No more polls to display</p>}
      >
      
      {allPolls.map((poll) => (
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
      </InfiniteScroll>
    </div>
    </DashboardLayout>
  )
}

export default MyPoll