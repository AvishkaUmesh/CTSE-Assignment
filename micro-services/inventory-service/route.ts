import express from "express";
import {
  createInventoryItemController,
  getAllInventoryItemsController,
  getInventoryItemByIdController,
  updateInventoryItemController,
  deleteInventoryItemController,
} from "./controller";

const router = express.Router();

// Inventory item routes
router.post("/", createInventoryItemController);
router.get("/", getAllInventoryItemsController);
router.get("/:id", getInventoryItemByIdController);
router.put("/:id", updateInventoryItemController);
router.delete("/:id", deleteInventoryItemController);

export default router;
