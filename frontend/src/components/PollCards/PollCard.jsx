import React, { useCallback, useContext, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { getPollBookmarked } from '../../utils/helper'
import PollActions from './PollActions'
import PollContent from './PollContent'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import PollingResultContent from './PollingResultContent'

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

    const { user, onUserVoted, toggleBookmarkId, onPollCreateOrDelete } = useContext(UserContext)

    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1)
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
    const handleInput = (value) => {
        if (type === 'rating') setRating(value)
        else if (type == 'open-ended') setUserResponse(value)
        else setSelectedOptionIndex(value)
    }

    //generate post data based on the poll type
    const getPostData = useCallback(() => {
        if (type === "open-ended") {
            return { responseText: userResponse, voterId: user._id }
        }
        if (type === "rating") {
            return { optionIndex: rating - 1, voterId: user._id }
        }
        return { optionIndex: selectedOptionIndex, voterId: user._id }
    }, [type, userResponse, rating, selectedOptionIndex, user])

    //get poll details by ID
    const getPollDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.POLLS.GET_BY_ID(pollId)
            )

            if (response.data) {
                const pollDetails = await axiosInstance.get(
                    API_PATHS.POLLS.GET_BY_ID(pollId)
                )

                if (response.data) {
                    const pollDetails = response.data
                    setPollResult({
                        options: pollDetails.options || [],
                        voters: pollDetails.voters.length || 0,
                        responses: pollDetails || []
                    })
                }
            }
        } catch (error) {
            console.log(error.response?.data?.message || "Erro submitting vote")
        }
    }

    //handles the submissions of votes
    const handleVoteSubmit = async () => {
        try {
            const response = await axiosInstance.post(
                API_PATHS.POLLS.VOTE(pollId),
                getPostData()
            )

            getPollDetail()
            setIsVotedCompleted(true)
            onUserVoted()
            toast.sucess("Vote submitted successfully")
        } catch (error) {
            console.log(error.response?.data?.message || "Erro submitting vote")
        }
    }

    //toggle tge bookmars status of a poll
    const toggleBookmark = async() =>{
        try {
            const response = await axiosInstance.post(
                API_PATHS.POLLS.BOOKMARK(pollId)
            )

            toggleBookmarkId(pollId)
            setPollBookmarked((prev) => !prev)
            toast.sucess(response.data.message)
        } catch (error) {
            console.log(error.response?.data?.message || "Eror bookmarking poll")
        }
    }

    //close Poll
    const closePoll = async() =>{
        try {
            const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId))

            if(response.data){
                setPollClosed(true)
                toast.success(response.data?.message || "Poll closed successfully")
            }
        } catch (error) {
            toast.error("Something went wrong. PLease try again")
            console.log("Something went wrong. PLease try again", error)
        }
    }

    //delete Poll
    const deletePoll = async() =>{
        try {
            const response = await axiosInstance.delete(API_PATHS.POLLS.DELETE(pollId))

            if(response.data){
                setPollDeleted(true)
                onPollCreateOrDelete()
                toast.success(response.data?.message || "Poll deleted successfully")
            }
        } catch (error) {
            toast.error("Something went wrong. PLease try again")
            console.log("Something went wrong. PLease try again", error)
        }
    }


    return (
        !pollDeleted &&
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
                    isVoteComplete={isVotedComplete}
                    inputCaptured={
                        !!(userResponse || selectedOptionIndex >= 0 || raring)
                    }
                    onVoteSubmit={handleVoteSubmit}
                    isBookmarked={pollBookmarked}
                    toggleBookmark={toggleBookmark}
                    isMyPoll={isMyPoll}
                    pollClosed={pollClosed}
                    onClosePoll={closePoll}
                    onDelete={deletePoll}
                />
            </div>

            <div className='ml14 mt-3'>
                <p className='text-[15px] text-black leading-8'>{question}</p>
                <div className='mt-4'>
                    {isVotedComplete || isPollClosed ? (<PollingResultContent
                        type={type}
                        options={pollResult.options || []}
                        voters={pollResult.voters}
                        responses={pollResult.responses || []}
                        />
                    ) : (
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
                    )}

                </div>
            </div>

        </div>

    )
}

export default PollCard