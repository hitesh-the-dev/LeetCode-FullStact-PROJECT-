const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Submission = require("../models/submission");

// registration
const register = async (req, res) => {
  try {
    //validate the data ki { firstName, emailId, password } ye chij exit krti bhi hai ya nhi
    //  req.body me and shi format me hai ya nhi

    if (!req.body) {
      throw new Error("Request body is missing");
    }
    console.log("Register Func called");

    validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";
    // ab agar koi registration ke time pr khud ko as "role":"admin" bhejega(es path se: localhost:3000/user/register) to phi uska role
    // user hi ho jayega(bcoz hm chate hai ki Admin hi dusre Admin ko register kra paye na ki
    // koi user )
    // **Q)To phir first admin register kese hoga??
    // usko MongoDb compass me jake hi register kr do , ya phir usko register krne ke badd ye
    //  feature add kro

    // user ne registration kr liya hai ab hmare pass two options hai ye to ab usko data ka
    // access de do ya phir ab usko login page pr leke jao , agar login krega to hi data milega
    // so after registeration he can access data
    const user = await User.create(req.body);
    console.log(user,"new user");
    

    const token = jwt.sign(
      { _id: user._id, emailId, role: "user" },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60, // 60 seconds * 60 minutes = 1 hour
      }
    );
    // res.cookie("token", token, { maxAge: 60 * 60 * 1000 }); //maxAge:max kitne time ke liye ye token rhega.(in msec)
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      httpOnly: true, // prevents JS access to the cookie
      sameSite: "lax", // controls cross-site sending of cookie
      // secure: true,        // enable this if using HTTPS
    });

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.status(201).json({
      user: reply,
      message: "User Registered Successfully",
    });

    //check khi ye emial phle se exist to nhi krti.

    // const ans = User.exists({ emailId }); //ye yes/no me ans dega , but ye step krne ki jarurat nhi hai
    //becz agar email phle se exist kr rhi hogi to ye step(await User.create(req.body))error throw kr dega.
  } catch (err) {
    res.status(400).send("Error:" + err);
  }
};

// login
const login = async (req, res) => {
  try {
    console.log("Login attempt received:", { emailId: req.body.emailId, passwordLength: req.body.password?.length });
    
    const { emailId, password } = req.body;

    if (!emailId) {
      console.log("No emailId provided");
      throw new Error("Invalid Credentials");
    }
    if (!password) {
      console.log("No password provided");
      throw new Error("Invalid credentials");
    }

    console.log("Looking for user with emailId:", emailId);
    // Check if user exists with exact emailId
    const user = await User.findOne({ emailId: emailId.toLowerCase() });
    
    // Also check all users for debugging
    const allUsers = await User.find({}, { emailId: 1, firstName: 1 });
    console.log("All users in database:", allUsers);
    
    if (!user) {
      console.log("User not found for emailId:", emailId);
      throw new Error("Invalid Credentials");
    }
    
    console.log("User found, checking password...");
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("Password mismatch for user:", emailId);
      throw new Error("Invalid Credentials");
    }
    
    console.log("Login successful for user:", emailId);

    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60, // 60 seconds * 60 minutes = 1 hour
      }
    );
    // res.cookie("token", token, { maxAge: 60 * 60 * 1000 }); //maxAge:max kitne time ke liye ye token rhega.(in msec)
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      httpOnly: true, // prevents JS access to the cookie
      sameSite: "lax", // controls cross-site sending of cookie
      // secure: true,        // enable this if using HTTPS
    });


    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.status(201).json({
      user: reply,
      message: "Loggin Successfully",
    });

  } catch (err) {
    res.status(401).send("Error:" + err);
  }
};

// logOut feature
const logout = async (req, res) => {
  //Token add kar denge Redis ke blockList me
  //Cookies ko clear kar dene ka bol denge

  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged Out Succesfully");
  } catch (err) {
    res.status(503).send("Error: " + err);
  }
};

const adminRegister = async (req, res) => {
  try {
    // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");
    validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    //

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("User Registered Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;

    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...

    // await Submission.deleteMany({userId});

    res.status(200).send("Deleted Successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};


module.exports = { register, login, logout, adminRegister, deleteProfile };
