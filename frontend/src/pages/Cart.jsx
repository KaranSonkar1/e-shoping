import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (!storedUser) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser).user;
    setUser(parsedUser);

    if (parsedUser.role !== "client") {
      toast.error("Access denied. Clients only.");
      navigate("/");
      return;
    }

    fetchCart(parsedUser);
  }, [navigate]);

  const fetchCart = async (user) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")).token;
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      toast.error("Failed to fetch cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")).token;
      await axios.delete(`/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item._id !== productId));
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cartItems.map((item) => (
            <div key={item._id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-700">${item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
