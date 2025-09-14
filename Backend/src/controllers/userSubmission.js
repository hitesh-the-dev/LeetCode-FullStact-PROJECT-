const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

// Function to parse error details and extract line numbers
const parseErrorDetails = (errorMessage, language) => {
  if (!errorMessage) return [];
  
  const errors = [];
  const lines = errorMessage.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    let errorInfo = {
      message: line.trim(),
      line: null,
      column: null,
      type: 'error'
    };
    
    // Parse different language error formats
    if (language === 'c++') {
      // C++ error format: filename.cpp:line:column: error: message
      const cppMatch = line.match(/(\w+\.cpp):(\d+):(\d+):\s*(error|warning):\s*(.+)/);
      if (cppMatch) {
        errorInfo.line = parseInt(cppMatch[2]);
        errorInfo.column = parseInt(cppMatch[3]);
        errorInfo.type = cppMatch[4];
        errorInfo.message = cppMatch[5];
      }
    } else if (language === 'java') {
      // Java error format: Exception in thread "main" java.lang.Exception: message at Main.main(Main.java:line)
      const javaMatch = line.match(/at\s+\w+\.\w+\((\w+\.java):(\d+)\)/);
      if (javaMatch) {
        errorInfo.line = parseInt(javaMatch[2]);
        errorInfo.message = line.replace(/at\s+\w+\.\w+\(\w+\.java:\d+\)/, '').trim();
      }
      // Also check for compilation errors
      const compMatch = line.match(/(\w+\.java):(\d+):\s*(error|warning):\s*(.+)/);
      if (compMatch) {
        errorInfo.line = parseInt(compMatch[2]);
        errorInfo.type = compMatch[3];
        errorInfo.message = compMatch[4];
      }
    } else if (language === 'javascript') {
      // JavaScript error format: ReferenceError: message at line:column
      const jsMatch = line.match(/at\s+.*?\(.*?\)\s+at\s+.*?\(.*?:(\d+):(\d+)\)/);
      if (jsMatch) {
        errorInfo.line = parseInt(jsMatch[1]);
        errorInfo.column = parseInt(jsMatch[2]);
      }
      // Also check for syntax errors
      const syntaxMatch = line.match(/SyntaxError:.*?\((\d+):(\d+)\)/);
      if (syntaxMatch) {
        errorInfo.line = parseInt(syntaxMatch[1]);
        errorInfo.column = parseInt(syntaxMatch[2]);
      }
    }
    
    errors.push(errorInfo);
  }
  
  return errors;
};

const submitCode = async (req, res) => {
  //
  console.log(req);
  
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language)
      return res.status(400).send("Some field missing");

    // Map frontend language codes to backend language codes
    const languageMapping = {
      'C++': 'c++',
      'Java': 'java', 
      'JavaScript': 'javascript'
    };
    language = languageMapping[language] || language;

    console.log(language);
    //    Fetch the problem from database
    const problem = await Problem.findById(problemId);
    //    testcases(Hidden)

    //   submissions ke two options hai :1)Phle code udge0 ko do then vha se jo code aaye
    //   with state(wrong, accepted, ..) usko DB me store krdo
    //   2)ho skta hai judge0 crash ho gya ya kisi or reason se usne koi res nhi diya
    //   to us case me hmare pass phla wala submission code hoga hi nhi(bcoz hmne khi store kiya hi nhi tha) esliye jb user code
    //   submit kre to phle usko DB me store kro with status:pending then code judge0 ko bhejo
    //   ab let judge0 ne jo res bheja hai usme status=wrong aaya hai then we wll update that
    //   submission in DB

    //   ====>We should follow 2nd approach

    //   Kya apne submission store kar du pehle....
    console.log("Creating submission with:", { userId, problemId, language, codeLength: code.length });
    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });
    console.log("Submission created successfully:", submittedResult._id);

    //    Judge0 code ko submit karna hai
    const languageId = getLanguageById(language);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);

    const resultToken = submitResult.map((value) => value.token);

    const testResult = await submitToken(resultToken);

    // es trah se judge0 output dega apn ko
    //     language_id: 54,
    //     stdin: '2 3',
    //     expected_output: '5',
    //     stdout: '5',
    //     status_id: 3,
    //     created_at: '2025-05-12T16:47:37.239Z',
    //     finished_at: '2025-05-12T16:47:37.695Z',
    //     time: '0.002',
    //     memory: 904,
    //     stderr: null,
    //     token: '611405fa-4f31-44a6-99c8-6f407bc14e73',

    // submittedResult ko update karo
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;
    let compilationError = null;
    let errorDetails = [];

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = "error";
          errorMessage = test.stderr;
          compilationError = test.stderr;
          errorDetails = parseErrorDetails(test.stderr, language);
        } else if (test.status_id == 5) {
          status = "error";
          errorMessage = "Time Limit Exceeded";
          compilationError = "Time Limit Exceeded";
        } else if (test.status_id == 6) {
          status = "error";
          errorMessage = "Compilation Error";
          compilationError = test.stderr;
          errorDetails = parseErrorDetails(test.stderr, language);
        } else if (test.status_id == 7) {
          status = "error";
          errorMessage = "Runtime Error";
          compilationError = test.stderr;
          errorDetails = parseErrorDetails(test.stderr, language);
        } else if (test.status_id == 8) {
          status = "error";
          errorMessage = "Memory Limit Exceeded";
          compilationError = "Memory Limit Exceeded";
        } else {
          status = "wrong";
          errorMessage = test.stderr || "Wrong Answer";
          compilationError = test.stderr;
          errorDetails = parseErrorDetails(test.stderr, language);
        }
      }
    }

    // Store the result in Database in Submission
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    console.log("Updating submission with final result:", {
      status,
      testCasesPassed,
      runtime,
      memory,
      submissionId: submittedResult._id
    });

    await submittedResult.save();
    console.log("Submission updated and saved successfully");

    // ProblemId ko insert karenge userSchema ke problemSolved mein if it is not persent there.

    // req.result ==> user Information

    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    const accepted = status == "accepted";
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
      error: errorMessage,
      compilationError,
      errorDetails,
      status
    });
  }
    catch(err){
      res.status(500).send("Internal Server Error "+ err);
    }
};

const runCode = async(req,res)=>{
     console.log('Run code endpoint hit!');
     console.log('Request body:', req.body);
     console.log('Problem ID:', req.params.id);
     
     try {
       const userId = req.result._id;
       const problemId = req.params.id;

       let { code, language } = req.body;

       console.log('Extracted data:', { userId, problemId, code: code?.substring(0, 100) + '...', language });

       if (!userId || !code || !problemId || !language) {
         console.log('Missing required fields:', { userId: !!userId, code: !!code, problemId: !!problemId, language: !!language });
         return res.status(400).send("Some field missing");
       }

       //    Fetch the problem from database
       const problem = await Problem.findById(problemId);
       console.log('Problem found:', !!problem);
       if (problem) {
         console.log('Problem visible test cases:', problem.visibleTestCases?.length);
       }
       //    testcases(Hidden)

       // Map frontend language codes to backend language codes
       const languageMapping = {
         'C++': 'c++',
         'Java': 'java', 
         'JavaScript': 'javascript'
       };
       language = languageMapping[language] || language;

       //    Judge0 code ko submit karna hai
       const languageId = getLanguageById(language);

       const submissions = problem.visibleTestCases.map((testcase) => ({
         source_code: code,
         language_id: languageId,
         stdin: testcase.input,
         expected_output: testcase.output,
       }));

       const submitResult = await submitBatch(submissions);

       const resultToken = submitResult.map((value) => value.token);

       const testResult = await submitToken(resultToken);

       let testCasesPassed = 0;
       let runtime = 0;
       let memory = 0;
       let status = true;
       let errorMessage = null;
       let compilationError = null;
       let errorDetails = [];

       for (const test of testResult) {
         if (test.status_id == 3) {
           testCasesPassed++;
           runtime = runtime + parseFloat(test.time);
           memory = Math.max(memory, test.memory);
         } else {
           if (test.status_id == 4) {
             status = false;
             errorMessage = test.stderr;
             compilationError = test.stderr;
             errorDetails = parseErrorDetails(test.stderr, language);
           } else if (test.status_id == 5) {
             status = false;
             errorMessage = "Time Limit Exceeded";
             compilationError = "Time Limit Exceeded";
           } else if (test.status_id == 6) {
             status = false;
             errorMessage = "Compilation Error";
             compilationError = test.stderr;
             errorDetails = parseErrorDetails(test.stderr, language);
           } else if (test.status_id == 7) {
             status = false;
             errorMessage = "Runtime Error";
             compilationError = test.stderr;
             errorDetails = parseErrorDetails(test.stderr, language);
           } else if (test.status_id == 8) {
             status = false;
             errorMessage = "Memory Limit Exceeded";
             compilationError = "Memory Limit Exceeded";
           } else {
             status = false;
             errorMessage = test.stderr || "Wrong Answer";
             compilationError = test.stderr;
             errorDetails = parseErrorDetails(test.stderr, language);
           }
         }
       }

       res.status(201).json({
         success: status,
         testCases: testResult,
         runtime,
         memory,
         error: errorMessage,
         compilationError,
         errorDetails,
         testCasesPassed
       });
     } catch (err) {
       res.status(500).send("Internal Server Error " + err);
     }
}


module.exports = {submitCode,runCode};



//     language_id: 54,
//     stdin: '2 3',
//     expected_output: '5',
//     stdout: '5',
//     status_id: 3,
//     created_at: '2025-05-12T16:47:37.239Z',
//     finished_at: '2025-05-12T16:47:37.695Z',
//     time: '0.002',
//     memory: 904,
//     stderr: null,
//     token: '611405fa-4f31-44a6-99c8-6f407bc14e73',


// User.findByIdUpdate({
// })

//const user =  User.findById(id)
// user.firstName = "Mohit";
// await user.save();
