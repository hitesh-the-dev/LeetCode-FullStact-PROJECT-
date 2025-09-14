const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem", // 👈 This tells Mongoose that this ObjectId references the "problem" collection
      required: true,

      // In Mongoose (a MongoDB ODM for Node.js), the ref option is used in a schema to create a reference from one document to another.
      // Here, problemSolved is an array of ObjectIds — each pointing to a document in the problem collection.

      //  this ref will help for populate :userProblem==>solvedAllProblembyUser
      //   const user = await User.findById(userId).populate({
      //   path: "problemSolved",
      //   select: "_id title difficulty tags",
      // });
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "c++", "java"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "wrong", "error"],
      default: "pending",
    },
    runtime: {
      type: Number, // milliseconds
      default: 0,
    },
    memory: {
      type: Number, // kB
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    testCasesTotal: {
      // Recommended addition
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
submissionSchema.index({userId:1 , problemId:1});

const Submission = mongoose.model('submission',submissionSchema);

module.exports = Submission;
