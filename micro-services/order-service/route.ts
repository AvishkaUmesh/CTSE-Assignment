import express from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrdersByCustomerIdController,
  updateOrderController,
  deleteOrderController,
} from "./controller";

const router = express.Router();

// Order routes
router.post("/", createOrderController);
router.get("/", getAllOrdersController);
router.get("/:id", getOrderByIdController);
router.get("/customer/:customerId", getOrdersByCustomerIdController); // Get orders by customer ID
router.put("/:id", updateOrderController);
router.delete("/:id", deleteOrderController);

export default router;
