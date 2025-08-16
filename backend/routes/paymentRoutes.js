import express from "express";
import razorpay from "../utils/razorpay.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", async (req, res) => {
  if (!razorpay) return res.status(500).json({ message: "Razorpay not configured" });

  const { amount, currency = "INR" } = req.body;
  const options = {
    amount: amount * 100, // convert to paise
    currency,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment (optional)
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay) return res.status(500).json({ message: "Razorpay not configured" });

  // Add your signature verification logic here
  res.json({ message: "Payment verification endpoint" });
});

export default router;
