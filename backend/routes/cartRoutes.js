import express from "express";
import Cart from "../models/Cart.js"; // Cart schema stores userId + products
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to allow clients only
const clientOnly = (req, res, next) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Clients only. Access denied." });
  }
  next();
};

// GET client cart
router.get("/", protect, clientOnly, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("products");
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [] });
    }
    res.json(cart.products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ADD product to cart
router.post("/", protect, clientOnly, async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [] });
    }

    cart.products.push(product._id);
    await cart.save();

    res.status(201).json({ message: "Product added to cart", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// REMOVE product from cart
router.delete("/:id", protect, clientOnly, async (req, res) => {
  const productId = req.params.id;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter((p) => p.toString() !== productId);
    await cart.save();

    res.json({ message: "Product removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
