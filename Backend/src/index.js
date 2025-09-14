const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const cors = require("cors");

// Setup CORS for your frontend URLs
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // your frontend dev URLs
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Define routes
app.use("/health", (res,req) => {
  res.send({
    "success": true,
    "msg":"Deployed Successfully"
  })
})
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);

// Use PORT from environment or fallback to 3000 locally
const PORT = process.env.PORT || 3000;



const InitalizeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log("Server listening at port number: " + PORT);
    });
  } catch (err) {
    console.log("Error: " + err);
  }
};

InitalizeConnection();
