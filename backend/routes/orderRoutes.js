import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

// Get current user's orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create order (checkout)
router.post("/checkout", protect, async (req, res) => {
  if (req.user.role === "admin") return res.status(403).json({ message: "Admins cannot place orders" });

  const { products } = req.body;
  if (!products || !products.length) return res.status(400).json({ message: "Cart is empty" });

  try {
    const total = products.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    const order = await Order.create({ user: req.user._id, products, total, status: "completed" });
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
