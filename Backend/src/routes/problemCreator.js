const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblembyUser,  
  submittedProblem,
  getAllSubmissions,
  createTestSubmission,
  getAllUserSubmissions,
} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");

// Create
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);
// // ye upper wale three kaam kevel admin hi kr skta hai

problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware, solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);
problemRouter.get("/allSubmissions", userMiddleware, getAllSubmissions);
problemRouter.post("/createTestSubmission", userMiddleware, createTestSubmission);
problemRouter.get("/userSubmissions", userMiddleware, getAllUserSubmissions);

module.exports = problemRouter;

// fetch
// update
// delete
