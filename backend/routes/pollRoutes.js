import { Router } from "express";
import protect from "../middlewares/authMiddleware.js";
import { bookmarkPoll, closePoll, CreatePoll, deletePoll, getAllPolls, getBookmarkedPolls, getPollById, getVotedPolls, voteOnPoll } from "../controllers/pollController.js";

const pollRouter = Router()

pollRouter.post('/create', protect, CreatePoll)
pollRouter.get("/getAllPolls",protect, getAllPolls)
pollRouter.get("/votedPolls",protect, getVotedPolls)
pollRouter.get("/:id",protect, getPollById)
pollRouter.post("/:id/vote",protect, voteOnPoll)
pollRouter.post("/:id/close",protect, closePoll)
pollRouter.post("/:id/bookmark",protect, bookmarkPoll)
pollRouter.get("/user/bookmarked",protect,getBookmarkedPolls)
pollRouter.delete("/:id/delete",protect, deletePoll)

export default pollRouter