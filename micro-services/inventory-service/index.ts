import express from "express";
import dotenv from "dotenv";
import router from "./route";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 5004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", router);

// Root route
app.get("/inventory-service", (req, res) => {
  res.send("🚀 Inventory service running");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Inventory Service is listening on http://localhost:${PORT}`);
});
