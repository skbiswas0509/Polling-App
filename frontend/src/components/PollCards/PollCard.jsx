import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { getPollBookmarked } from '../../utils/helper'
import PollActions from './PollActions'
import PollContent from './PollContent'

const PollCard = ({
    pollId,
    question,
    type,
    options,
    voters,
    responses,
    creatorProfileImg,
    creatorName,
    creatorUsername,
    userHasVoted,
    isMyPoll,
    isPollClosed,
    createdAt
}) => {

    const {user} = useContext(UserContext)

    const[selectedOptionIndex, setSelectedOptionIndex] = useState(-1)
    const [rating, setRating] = useState(0)
    const [userResponse, setUserResponse] = useState("")

    const [isVotedComplete, setIsVotedCompleted] = useState(userHasVoted)
    const [pollResult, setPollResult] = useState({
        options,
        voters,
        responses
    })

    const isPollBookmarked = getPollBookmarked(
        pollId,
        user.bookmarkedPolls || []
    )

    const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked)
    const [pollClosed, setPollClosed] = useState(isPollClosed || false)
    const [pollDeleted, setPollDeleted] = useState(false)

    //handles user input based on the poll type
    const handleInput = (value) =>{
        if(type === 'rating') setRating(value)
        else if(type == 'open-ended') setUserResponse(value)
    else setSelectedOptionIndex(value)
    }
    
  return !pollDeleted &&
    <div className='bg-slate-100/50 my-5 p-5 rounded-lg border border-slate-100 mx-auto'>
        <div className='flex items-start justify-between'>
            <UserProfileInfo
            imgUrl={creatorProfileImg}
            fullName={creatorUsername}
            username={creatorUsername}
            createdAt={createdAt}
            />

            <PollActions
            pollId={pollId}
            isVoteComplete={isVoteComplete}
            inputCaptured={
                !!(userResponse || selectedOptionIndex >= 0 || raring)
            }
            onVoteSubmit={()=>{}}
            isBookmarked={pollBookmarked}
            toggleBookmark={()=>{}}
            isMyPoll={isMyPoll}
            pollClosed={pollClosed}
            onClosePoll={() => {}}
            onDelete={() => {}}
            />
        </div>

        <div className='ml14 mt-3'>
            <p className='text-[15px] text-black leading-8'>{question}</p>
            <div className='mt-4'>
                <PollContent
                type={type}
                options={options}
                selectedOptionIndex={selectedOptionIndex}
                onOptionSelect={handleInput}
                rating={rating}
                onRatingChnage={handleInput}
                userResponse={userResponse}
                onResponseChange={handleInput}
                />
            </div>
        </div>
    
    </div>
  
}

export default PollCard