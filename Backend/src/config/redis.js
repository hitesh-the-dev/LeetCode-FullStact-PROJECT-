const { createClient } = require("redis");
// In your redis.js file, add this before createClient:
console.log('Redis Config:', {
  host: process.env.REDIS_HOST_ID,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS ? '***' : 'undefined'
});
const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST_ID,
    port: parseInt(process.env.REDIS_PORT), // Ensure port is a number
  },
});

// Add error handling
redisClient.on("error", (err) => {
  console.log("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis Cloud");
});

redisClient.on("ready", () => {
  console.log("Redis Client Ready");
});

module.exports = redisClient;
