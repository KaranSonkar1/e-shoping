import React, { useEffect, useState } from "react";
import API from "../api.js";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(localStorage.getItem("user"));
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const amount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(amount);
  }, [cart]);

  const handlePayment = async () => {
    if (!user) return alert("Please login");

    try {
      const { data } = await API.post("/payment/create-order", {
        amount: total,
        products: cart.map(c => ({ product: c._id, quantity: c.quantity })),
        userId: user.id
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        handler: async function (response) {
          await API.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            email: user.email,
            phone: "+91XXXXXXXXXX" // replace with user phone
          });
          alert("Payment Successful");
          localStorage.removeItem("cart");
          navigate("/");
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <h4>Total Amount: ₹{total}</h4>
      <button className="btn btn-primary" onClick={handlePayment}>Pay with Razorpay</button>
    </div>
  );
};

export default Checkout;
