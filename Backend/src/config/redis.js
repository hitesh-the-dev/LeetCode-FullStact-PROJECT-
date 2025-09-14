const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST_ID,
    port: process.env.REDIS_PORT,
  },
});

module.exports = redisClient
