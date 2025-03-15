const io = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server:", socket.id);

  // Send a test message
  socket.emit("test_event", { message: "Hello from test client!" });
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

socket.on("test_response", (data) => {
  console.log("✅ Received response:", data);
});
