const {getLanguageById,submitBatch,submitToken}=require("../utils/problemUtility");
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const mongoose = require('mongoose');

// Problem creation  ka kaam Admin krega

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  /*  Q)Kya en upper wali chijo ko direct DB me add kr dena chahiye ??
        Ans:No , phle apn ko check krna pdega ki kya jo referenceSOlution aaya hai vo shi
            bhi hai ya nhi(run on provided test case)

        let c++ ka codecheck kr rhe hai:
               as input
        Input ========>to C++code =======>Output

        ======================
        // language:C++
        language_id:(hr lang ki hoti hai) ye bta degi ki konsi language hai
        source_Code:"ffjsjffkd"
        stdin:23 //input
        expected_output:344
        =====================
        ye part Judge0 ko denge to vo bta dega ki shi hai ya nhi

        Go to documentation of judge0(easy to understand hai)


    */

  try {
    console.log("Creating problem with data:", {
      title,
      difficulty,
      tags,
      visibleTestCases: visibleTestCases?.length,
      hiddenTestCases: hiddenTestCases?.length,
      startCode: startCode?.length,
      referenceSolution: referenceSolution?.length
    });

    // Validate required fields
    if (!title || !description || !difficulty || !tags || !visibleTestCases || !hiddenTestCases || !startCode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Optional: Validate reference solutions with Judge0 (commented out for now)
    /*
    if (referenceSolution && referenceSolution.length > 0) {
      for (const { language, completeCode } of referenceSolution) {
        const languageId = getLanguageById(language);
        const submissions = visibleTestCases.map((testcase) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output,
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        for (const test of testResult) {
          if (test.status_id != 3) {
            return res.status(400).json({ error: "Reference solution failed test cases" });
          }
        }
      }
    }
    */

    // Create the problem
    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    console.log("Problem created successfully:", userProblem._id);
    res.status(201).json({ 
      message: "Problem Saved Successfully",
      problemId: userProblem._id
    });
  } catch (err) {
    console.error("Error creating problem:", err);
    res.status(500).json({ error: "Error: " + err.message });
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    console.log("Updating problem with ID:", id);
    console.log("Update data:", {
      title,
      difficulty,
      tags,
      visibleTestCases: visibleTestCases?.length,
      hiddenTestCases: hiddenTestCases?.length,
      startCode: startCode?.length,
      referenceSolution: referenceSolution?.length
    });

    if (!id) {
      return res.status(400).json({ error: "Missing ID Field" });
    }

    const existingProblem = await Problem.findById(id);

    if (!existingProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Optional: Validate reference solutions with Judge0 (commented out for now)
    /*
    if (referenceSolution && referenceSolution.length > 0) {
      for (const { language, completeCode } of referenceSolution) {
        const languageId = getLanguageById(language);
        const submissions = visibleTestCases.map((testcase) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output,
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        for (const test of testResult) {
          if (test.status_id != 3) {
            return res.status(400).json({ error: "Reference solution failed test cases" });
          }
        }
      }
    }
    */

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );

    console.log("Problem updated successfully:", updatedProblem._id);
    res.status(200).json({
      message: "Problem updated successfully",
      problem: updatedProblem
    });
  } catch (err) {
    console.error("Error updating problem:", err);
    res.status(500).json({ error: "Error: " + err.message });
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) return res.status(404).send("Problem is Missing");

    res.status(200).send("Successfully Deleted");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");

    // const getProblem = await Problem.findById(id); //ye bydefault complete question lake
    //dega mean hidden test case problem creator's id, ....

    const getProblem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases startCode referenceSolution "
    );
    // const getProblem = await Problem.findById(id).select('-hiddenTestcase');ab ye property select nhi hogi

    if (!getProblem) return res.status(404).send("Problem is Missing");

    res.status(200).send(getProblem);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const getProblem = await Problem.find({}).select(
      "_id title difficulty tags"
    );
    // sabhi problems ko ek sath nhi dikhayenge, we will use pagenation concept so that ek sath sara data na lana pda(so that it will
    // take less waiting time)

    // localhost:3000/problem/getAllProblem?page=1&limit=10 es trah se hm req bhejenge ki hr page pr 10 problems show krna/bhejna

    // // Pagination:
    //   const page = 2;
    //   const limit = 10;
    //   const skip(kitne pages ko skip krna hai) = (page - 1) * limit;

    //   Problem.find({difficulty:'easy'}).skip(skip).limit(limit);

    // Filtering:

    // Problem.find({
    //   difficulty: "easy",
    //   tags: "array",
    // });

    // Problem.find({
    //   votes: { $gte: 100 },
    //   tags: { $in: ["array", "hashmap"] },
    // });

    //     Operators and Their MongoDB Equivalents

    // | Operator | Meaning               | Example URL Query         | MongoDB Equivalent                               |
    // |----------|------------------------|----------------------------|--------------------------------------------------|
    // | $eq      | Equal                 | ?difficulty=easy           | { difficulty: "easy" }                           |
    // | $ne      | Not equal             | ?difficulty[ne]=hard       | { difficulty: { $ne: "hard" } }                  |
    // | $gt      | Greater than          | ?votes[gt]=100             | { votes: { $gt: 100 } }                          |
    // | $gte     | Greater than or equal | ?votes[gte]=100            | { votes: { $gte: 100 } }                         |
    // | $lt      | Less than             | ?votes[lt]=50              | { votes: { $lt: 50 } }                           |
    // | $lte     | Less than or equal    | ?votes[lte]=50             | { votes: { $lte: 50 } }                          |
    // | $in      | Match any in array    | ?tags[in]=array,hashmap    | { tags: { $in: ["array", "hashmap"] } }          |
    // | $nin     | Exclude from array    | ?tags[nin]=dp              | { tags: { $nin: ["dp"] } }                       |

    if (getProblem.length == 0)
      return res.status(404).send("Problem is Missing");

    res.status(200).send(getProblem);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

// const solvedAllProblembyUser = async (req, res) => {
//   try {
//     const userId = req.result._id;

//     const user = await User.findById(userId).populate({
//       path: "problemSolved",
//       select: "_id title difficulty tags",
//     });

//     //       🔍 What does .populate() do?

//     // When you call:

//     // const user = await User.findById(userId).populate({
//     //   path: "problemSolved",
//     //   select: "_id title difficulty tags"
//     // });

//     // Mongoose:

//     // Looks at the problemSolved array (which contains ObjectIds),

//     // Follows the ref: 'problem' in the schema,

//     // And replaces each ObjectId in that array with the actual problem document, including only the selected fields (_id, title, difficulty, tags).

//     // So instead of:

//     // problemSolved: [
//     //   "64f828...abc",
//     //   "64f9b1...def"
//     // ]

//     // You get:

//     // problemSolved: [
//     //   {
//     //     "_id": "64f828...abc",
//     //     "title": "Two Sum",
//     //     "difficulty": "easy",
//     //     "tags": ["array", "hashMap"]
//     //   },
//     //   {
//     //     "_id": "64f9b1...def",
//     //     "title": "Longest Substring",
//     //     "difficulty": "medium",
//     //     "tags": ["slidingWindow"]
//     //   }
//     // ]

//     res.status(200).send(user.problemSolved);
//   } catch (err) {
//     res.status(500).send("Server Error");
//   }
// };

const solvedAllProblembyUser = async (req, res) => {
  try {
    // Get user's solved problem IDs directly from middleware
    const solvedProblemIds = req.result.problemSolved;

    if (!solvedProblemIds || solvedProblemIds.length === 0) {
      return res
        .status(200)
        .json({ message: "User hasn't solved any problems yet." });
    }

    // Fetch problem documents using $in operator for all solved problem IDs
    const solvedProblems = await Problem.find({
      _id: { $in: solvedProblemIds },
    });

    return res.status(200).json(solvedProblems);
  } catch (error) {
    console.error("Error fetching solved problems:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const submittedProblem = async(req,res)=>{

  try{

    const userId = req.result._id;
    const problemId = req.params.pid;

    console.log("Fetching submissions for userId:", userId, "problemId:", problemId);
    console.log("Query parameters:", { userId, problemId });

    // Convert string IDs to ObjectId for proper querying
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const problemObjectId = new mongoose.Types.ObjectId(problemId);

    console.log("Converted ObjectIds:", { userObjectId, problemObjectId });

    // First, let's check if there are any submissions at all for this user
    const allUserSubmissions = await Submission.find({userId: userObjectId});
    console.log("All submissions for this user:", allUserSubmissions.length);

    // Then check submissions for this specific problem
    const ans = await Submission.find({
      userId: userObjectId,
      problemId: problemObjectId
    });
    console.log("Submissions for this problem:", ans.length);
    console.log("Found submissions:", ans);

    if(ans.length==0) {
      console.log("No submissions found for this problem");
      return res.status(200).json([]); // Return empty array instead of string
    }

    return res.status(200).json(ans);

  }
  catch(err){
     console.error("Error fetching submissions:", err);
     console.error("Error stack:", err.stack);
     return res.status(500).json({ 
       error: "Internal Server Error",
       details: err.message,
       stack: err.stack
     });
  }
}

// Test endpoint to check all submissions
const getAllSubmissions = async(req,res)=>{
  try{
    console.log("Testing database connection...");
    const allSubmissions = await Submission.find({});
    console.log("Total submissions in database:", allSubmissions.length);
    console.log("Sample submission:", allSubmissions[0]);
    return res.status(200).json({
      count: allSubmissions.length,
      submissions: allSubmissions
    });
  }
  catch(err){
    console.error("Error fetching all submissions:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

// Test endpoint to create a test submission
const createTestSubmission = async(req,res)=>{
  try{
    const userId = req.result._id;
    const { problemId } = req.body;
    
    console.log("Creating test submission for userId:", userId, "problemId:", problemId);
    
    const testSubmission = await Submission.create({
      userId,
      problemId,
      code: "console.log('test');",
      language: "javascript",
      status: "accepted",
      testCasesPassed: 1,
      testCasesTotal: 1,
      runtime: 0.001,
      memory: 1000
    });
    
    console.log("Test submission created:", testSubmission._id);
    return res.status(200).json({ message: "Test submission created", submission: testSubmission });
  }
  catch(err){
    console.error("Error creating test submission:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

// Get all user submissions for heatmap
const getAllUserSubmissions = async(req,res)=>{
  try{
    const userId = req.result._id;
    
    console.log("Fetching all submissions for userId:", userId);
    
    const submissions = await Submission.find({userId: userId})
      .select('createdAt status')
      .sort({createdAt: 1});
    
    console.log("Found submissions:", submissions.length);
    
    return res.status(200).json(submissions);
  }
  catch(err){
    console.error("Error fetching user submissions:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}


module.exports = {
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
};

// const submissions = [
//     {
//       "language_id": 46,
//       "source_code": "echo hello from Bash",
//       stdin:23,
//       expected_output:43,
//     },
//     {
//       "language_id": 12,
//       "source_code": "print(\"hello from Python\")"
//     },
//     {
//       "language_id": 72,
//       "source_code": ""
//     }
//   ]es array ko apn Judge0 ko submit krenge , agar ek ek test case bheje to number of API
//   call will inc
