const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const main = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");

console.log("Frontend URL:", process.env.FRONTEND_URL);

// Setup CORS for your frontend URLs
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // your frontend dev URLs
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Define routes
app.get("/", (req, res) => {
  res.send({
    success: true,
    msg: "Deployed Successfully",
  });
});
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);

// Use PORT from environment or fallback to 3000 locally
const PORT = process.env.PORT || 3000;



const InitalizeConnection = async () => {
  try {
    // Connect to MongoDB first
    await main();
    console.log("MongoDB Connected");

    // Then connect to Redis
    await redisClient.connect();
    console.log("Redis Connected");

    app.listen(PORT, () => {
      console.log("Server listening at port number: " + PORT);
    });
  } catch (err) {
    console.log("Error during startup:", err);
    process.exit(1); // Exit if connection fails
  }
};

InitalizeConnection();
