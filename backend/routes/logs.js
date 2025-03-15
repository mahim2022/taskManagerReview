const express = require("express");
const Log = require("../models/Log");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
}
});

// Get logs
router.get("/", async (req, res) => {
try {
  const logs = await Log.find().sort({ timestamp: -1 });
  res.json(logs);
} catch (err) {
  res.status(400).json({ error: err.message });
}
});

module.exports = router;
