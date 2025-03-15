const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Pool } = require("pg");
const redis = require("redis");
const authRoutes = require("./routes/auth");
const logRoutes = require("./routes/logs");
const amqp = require("amqplib");
const { Server } = require("socket.io");
const http = require("http"); // Add this line




dotenv.config();
const app = express();
//socketio
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change to your frontend port if different
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Redis Connection
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
redisClient.connect()
  .then(() => console.log("Connected to Redis"))
  .catch(err => console.error("Redis connection error:", err));

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("taskQueue");

    console.log("Connected to RabbitMQ");

    channel.consume("taskQueue", (msg) => {
      console.log("Received:", msg.content.toString());
      channel.ack(msg);
    });
  } catch (err) {
    console.error("RabbitMQ Error:", err);
  }
}
connectRabbitMQ();

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("test_event", (data) => {
    console.log("📩 Received test event:", data);
    socket.emit("test_response", { message: "Hello from server!" });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


async function publishMessage(message) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("taskQueue");
  channel.sendToQueue("taskQueue", Buffer.from(message));
  console.log("Message Sent:", message);
}

// Example Usage
publishMessage("New Task Created!");

////////////////////////////////////////////
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  redisClient.get(key, (err, data) => {
    if (err) throw err;
    if (data) {
      return res.json(JSON.parse(data));
    }
    next();
  });
};
// Sample route
app.get("/api/tasks", cacheMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    redisClient.setex(req.originalUrl, 3600, JSON.stringify(result.rows)); // Cache for 1 hour
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/auth", authRoutes);

app.use("/api/logs", logRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
