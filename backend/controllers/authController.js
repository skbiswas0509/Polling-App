import UserModel from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

//generate jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn : "1h"})
}

//register user
const registerUser = async(req, res) =>{
    const {fullName, username, email, password, profileImageUrl} = req.body

    // validation: check for missing data
    if(!fullName || !username || !email || !password || !profileImageUrl) {
        return res.status(400).json({message: "All fields are required"})
    }

    //validation:check username format
    //allows alphanumeric characters and hyphens only
    const usernameRegex = /^[a-zA-Z0-9-]+$/
    if (!usernameRegex.test(username)){
        return res.status(400).json({
            message : "Invalid characters.only alphasnumemic characters onyly. no spaces are permitted"
        })
    }

    try {
        //check if email already exists
        const existingUser = await UserModel.findOne({ email })
        if(existingUser){
            return res.status(400).json({ message : "Email already in use "})
        }

        //check if username alreadu exists
        const existingUsername = await UserModel.find({ username })
        if(existingUsername){
            return res.status(400).json({ message : "Username not available"})
        }

        //create an user
        const user = await UserModel.create({
            fullName,
            username,
            email,
            password,
            profileImageUrl
        })

        res.status(201).json({
            id : user._id,
            user,
            token: generateToken(user._id)
        })
    } catch (error) {
        return res.status(500).json({
            message : "Error registerting user",
            error : error.message
        })
    }
}

//login user
const loginUser = async(req, res) => {
    const {email, password} = req.body

    //validatio ncheckin for missing fields
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"})
    }

    try {
        const user = await UserModel.findOne({ email })
        if(!user || !(await UserModel.comparePassword(password))){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        res.status(200).json({
            id : user._id,
            user : {
                ...user.toObject(),
                totalPollsCreated : 0,
                totalPollsVotes : 0,
                totalPollsBookmarked : 0
            },
            token: generateToken(user._id)
        })
    } catch (error) {
        return res.status(500).json({
            message : "Error registerting user",
            error : error.message
        })
    }
}

//getUser
const getUserInfo = async(req, res) =>{
    try {
        const user = await UserModel.findById(req.user.id).select("-password")

        if(!user){
            return res.status(404).json({message : "User not found"})
        }

        //add the new attributes to thte response
        const userInfo = {
            ...user.toObject(),
            totalPollsCreated : 0,
            totalPollsVotes : 0,
            totalPollsBookmarked : 0
        }

        res.status(200).json(userInfo)
    } catch (error) {
        return res.status(500).json({
            message : "Error getting userInfo", 
            error : error.message
        })
    }
}

export {registerUser, loginUser, getUserInfo}
