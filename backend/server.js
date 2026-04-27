require("dotenv").config();
// Redis/BullMQ click worker is temporarily disabled.
// require("./app/services/queue.service");
const http = require("http");
const app = require("./app/app");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Graceful shutdown and global error handling could be added here
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
