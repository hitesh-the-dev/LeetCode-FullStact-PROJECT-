const express = require("express");

const authRouter = express.Router();
const {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
} = require("../controllers/userAuthent");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Register
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.delete("/deleteProfile", userMiddleware, deleteProfile);

//  *Q)jb apn coder army ki website pr jate hai to vha apn login button pr click krte hai to turnt hi apn enter ho jate
//     hai website me apnko login krna hi nhi pda, esa kese hua ?
//  Ans:jaise hi apn us button pr click krte hai to browser token ko backend me bhejta hai then backend me check ho jata
//      hai ki ye valid user hai ya nhi agar valid user hai to apn enter ho jate hai apn ko login nhi krna pdta
//      agar user first time aa rha hai website pr then req ke sath token nhi jayega, es case ko bhi apnne handle kr
//      rkha hai banckend me ===> apn usko msg bhej denge ki token is not present

//  apn es chij ko frontend me check nhi kr skte bcoz apn code se browser ke cookie se token ko accesw nhi kr skte

// apn es token ko redux me store nhi kr skte bcoz jaise hi tab close hoga to redux ka data loss ho jayega bcoz redux
// in memory(RAM) me data ko store krta hai, and na hi localStorage me store kr skte hai bcoz localStorage me agar
// token hai to hack ho skta hai

// esi functionality ko apn bna rhe hai niche ke es /check se
authRouter.get("/check", userMiddleware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role,
  };

  res.status(200).json({
    user: reply,
    message: "Valid User",
  });
});

// authRouter.get('/getProfile',getProfile);

module.exports = authRouter;

// login
// logout
// GetProfile
