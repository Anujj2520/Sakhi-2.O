const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
  })
);

app.use(express.json());

// Data file paths
const devicesFile = path.join(__dirname, "data", "devices.json");
const alertsFile = path.join(__dirname, "data", "alerts.json");

// Read JSON file
function readJSON(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error("Error reading:", filePath, error.message);
    throw error;
  }
}

// Save JSON file
function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sakhi 2.0 Backend is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Sakhi backend is healthy",
  });
});

// Get all devices
app.get("/api/devices", (req, res) => {
  try {
    const devices = readJSON(devicesFile);

    res.json({
      success: true,
      count: devices.length,
      devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to read devices",
    });
  }
});

// Get all emergency alerts
app.get("/api/alerts", (req, res) => {
  try {
    const alerts = readJSON(alertsFile);

    res.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to read alerts",
    });
  }
});

// Create a test emergency alert
app.post("/api/alerts", (req, res) => {
  try {
    const alerts = readJSON(alertsFile);

    const alert = {
      id: `ALERT-${Date.now()}`,
      deviceId: req.body.deviceId || "Sakhi-001",
      type: req.body.type || "SOS",
      message: req.body.message || "Test SOS alert",
      latitude: req.body.latitude ?? null,
      longitude: req.body.longitude ?? null,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    alerts.unshift(alert);
    saveJSON(alertsFile, alerts);

    res.status(201).json({
      success: true,
      message: "Emergency alert created",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create alert",
    });
  }
});

// Unknown route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Sakhi backend running at http://localhost:${PORT}`);
});