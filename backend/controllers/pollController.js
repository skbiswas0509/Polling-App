import pollModel from "../models/Poll.js"
import UserModel from "../models/User.js"

//create new poll
const CreatePoll = async(req, res) => {
    const { qeustion, type, options, creatorId } = req.body

    if(!qeustion || !type || !creatorId){
        return res.status(400).json({
            message : "Question, type, and creatorId are required"
        })
    }

    try {
        let processedOptions = []
        switch(type){
            case "single-choice":
                if(!options || options.length < 2){
                    return res.status(400).json({
                        message: "Single-choice poll must have at least two options"
                    })
                }
                processedOptions = options.map((option) => ({ optionText: option}))
                break
            
            case "rating":
                processedOptions = [1,2,3,4,5].map((value)=>({
                    optionText: value.toString()
                }))
                break
            
            case "yes/no":
                processedOptions = ["Yes", "No"].map((option) =>({
                    optionText: option
                }))
                break
            
            case "image-based":
                if(!options || options.length < 2){
                    return res.status(400).json({
                        message : "Images-based polls must have an at least two image URls"
                    })
                }
                processedOptions = options.map((url) => ({ optionText: url }))
                break

            case "open-ended":
                processedOptions = [] //no options for open ended
                break

            default:
                return res.status(400).json({
                    message : "Inavlid poll type"
                })
        }

        const newPoll = await pollModel.create({
            qeustion,
            type,
            options : processedOptions,
            creator: creatorId
        })

        res.status(201).json(newPoll)

    } catch (error) {
        return res.status(500).json({
            message : "Error registering user",
            error : error.message
        })
    }
}

//get all polls
const getAllPolls = async(req, res)=>{
    const {type, creatorId, page = 1, limit = 10 } = req.query
    const filter = {}
    const userId = req.user._id

    if(type) filter.type = type
    if(creatorId) filter.createor = creatorId

    try {
        //clculate pagination parameter
        const pageNumber = parseInt(page, 10)
        const pageSize = parseInt(limit, 10)
        const skip = (pageNumber - 1) * pageSize

        //fetch polls with pagination
        const polls = await pollModel.find(filter)
        .populate("creator", "fullName username email profileImageUrl")
        .populate({
            path: "response.voterId",
            select: "username profileImageUrl fullName"
        })
        .skip(skip)
        .limit(pageSize)
        .sort({ creatorAt: -1})
        
        //add 'userHasVoted' flag for each poll
        const updatedPOlls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => 
                voterId.equals(userId)
            )
            return {
                ...poll.toObject(),
                userHasVoted
            }
        })

        //get total count of polls for pagination metadata 
        const totalPolls = await polls.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    type: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ])

        //ensure all types are icluse in statsm ecen those wit zero counts
        const allTypes = [
            {
                type: "single-choice", label: "Single Choice"
            },
            {
                type: "yes/no", label: "Yes/No"
            },
            {
                type: "rating", label: "Rating"
            },
            {
                type: "image-based", label: "Image Based"
            },
            {
                type: "open-ended", label: "Open Ended"
            }
        ]
        const statsWithDefaults = allTypes
        .map((pollType) => {
            const stat = stats.find( (item)=> item.type === pollType.type)
            return {
                label: pollType.label,
                type: pollType.type,
                count: stat ? stat.count : 0
            }
        })
        .sort((a,b) => b.count- a.count)

        return res.status(200).json({
            polls: updatedPOlls,
            currentPages: pageNumber,
            totalPages: Math.ceil(totalPages / pageSize),
            totalPolls,
            stats: statsWithDefaults
        })
    } catch (error) {
        return res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

//get all voted polls
const getVotedPolls = async(req, res)=>{
    const { page = 1, limit = 10 } =req.query
    const userId = req.user._id
    try {
        //calculate pagination parameters
        const pageNumber = parseInt(page, 10)
        const pageSize = parseInt(limit, 10)
        const skip = (pageNumber - 1) * pageSize

        //fetch polls where the user has voted
        const polls = await pollModel.find({ voters: userId}) // filter by polls where the user's id exists
        .populate("creator", "fullName profileImageUrl username email")
        .populate({
            path: "response.voterId",
            select: "username profileImageUrl fullName"
        })
        .skip(skip)
        .limit(pageSkip)

        //add 'user has voted' flag for each set
        const updatedPolls = polls.map((poll)=>{
            const userHasVoted = poll.voters.some((voterId) =>
                voterId.equals(userId)
            )
            return {
                ...poll.toObject(),
                userHasVoted
            }
        })

        //get total count of voted polls for pagination metadata
        const totalVotedPolls = await pollModel.countDocuments({ voters: userId })

        return res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(toalVotedPolls / pageSize),
            totalVotedPolls
        })
    } catch (error) {
        return res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

//get poll by id
const getPollById = async(req, res)=>{
    const {id} = req.params
    try {
        const poll = await pollModel.findById(id).populate("creator","username email")
        if(!poll){
            return res.status(404).json({
                message : "poll not found"
            })
        }

        return res.status(200).json(poll)
    } catch (error) {
        return res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

//votepolls
const voteOnPoll = async(req, res)=>{
    const {id} = req.params
    const {optionIndex, voterId, responseText} = req.body
    
    try {
        const poll = await pollModel.findById(id)
        if(!poll){
            return res.status(404).json({message: "Poll not found"})
        }    

        if(poll.closed){
            return res.status(400).json({ message : "POll is closed"})
        }

        if(poll.voters.includes(voterId)) {
            return res.status(400).json({
                message : "User has already voted on the poll"
            })
        }
        if(poll.type === "open-ended"){
            if(!responseText){
                return res.status(400).json({
                    message:  "Response text is required for open-ended polls"
                })
            }
            poll.responses.push({ voterId, responseText})
        }else{
            if( 
                optionIndex === undefined ||
                optionIndex < 0 ||
                optionIndex >= poll.options.length
            ){
                return res.status(400).json({
                    message : "invalid option index"
                })
            }
            poll.option(optionIndex).votes += 1
        }

        poll.voters.push(voterId)
        await poll.save()

        return res.status(200).json(poll)
    } catch (error) {
        return res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

//close polls
const closePoll = async(req, res)=>{
    const { id } = req.params
    const userId = req.user.id

    try {
        const poll = await pollModel.findById(id)
        
        if(!poll){
            return res.status(404).json({message: "POll not found"})
        }

        if(poll.creator.toString() !== userId){
            return res.status(403).json({
                message: "you are not authorized to close this poll"
            })
        }

        poll.closed = true
        await poll.save()

        return res.status(200).json({
            messsage: 'Polls closed successfully',
            poll
        })
    } catch (error) {
        return res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

//bookmark polls
const bookmarkPoll = async(req, res)=>{
    const { id } = req.params //poll id
    const userId = req.user.id
    try {
        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(404).json({ message : "User not found"})
        }

        //check if the poll is already bookmarked
        const isBookmarked = UserModel.bookmarkedPolls.include(id)

        if(isBookmarked){
            //remove poll from bookmarks
            UserModel.bookmarkedPolls = UserModel.bookmarkedPolls.filter(
                (pollId) => pollId.toString() !== id
            )

            await UserModel.save()
            return res.status(200).json({
                message :  "Poll removed from bookmarks",
                bookmarkedPolls: UserModel.bookmarkedPolls
            })
        }

        //add polls to bookmark
        UserModel.bookmarkedPolls.push(id)
        await UserModel.save()
        return res.status(200).json({
            message: "poll bookmarked successfully",
            bookmarkedPolls: UserModel.bookmarkedPolls
        })
    } catch (error) {
        return res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

//get all bookmarked polls
const getBookmarkedPolls = async(req, res)=>{
    const userId = req.user.id

    try {
        const user = await UserModel.findById(userId).populate({
            path: "bookmarkedPolls",
            populate: {
                path: "creator",
                select: "fullName username profileImageUrl"
            }
        })   
        
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        const bookmarkedPolls = UserModel.bookmarkedPolls
        //add 'userhadvoted' flag for each poll
        const updatedPolls = bookmarkedPolls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) =>
            voterId.equals(userId)
        )
        return {
            ...poll.toObject(),
            userHasVoted
        }
        })

        return res.status(200).json({ bookmarkedPolls: updatedPolls })
    } catch (error) {
        return res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

//delete polls
const deletePoll = async(req, res)=>{
    const {id} = req.params
    const userId = req.user.id

    try {
        const poll = await pollModel.findById(id)

        if(!poll){
            return res.status(404).json({ message: "Poll not found" })
        }

        if(poll.creator.toString() !== userId){
            return res.status(403).json({
                message: "You are not authorized to delete this poll"
            })
        }

        await pollModel.findByIdAndDelete(id)

        return res.status(200).json({ message: "Poll deleted successfully"})
    } catch (error) {
        return res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

export {CreatePoll, getAllPolls, getVotedPolls, getPollById, 
    voteOnPoll, closePoll, bookmarkPoll, getBookmarkedPolls, deletePoll}