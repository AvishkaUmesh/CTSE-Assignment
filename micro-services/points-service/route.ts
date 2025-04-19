import express from "express";
import {
  addPointsController,
  deductPointsController,
  getPointsBalanceController,
  getAllCustomersPointsController,
} from "./controller";

const router = express.Router();

// Points routes
router.post("/add", addPointsController);
router.post("/deduct", deductPointsController);
router.get("/balance/:userId", getPointsBalanceController);
router.get("/customers", getAllCustomersPointsController); // Admin-only route

export default router;
