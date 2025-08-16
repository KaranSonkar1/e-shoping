import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };

    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUser(JSON.parse(storedUser).user);

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    if (!user) return toast.error("Please login first");

    try {
      const token = JSON.parse(localStorage.getItem("userInfo")).token;
      await axios.post(
        "/api/cart",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Shop Our Products</h1>
      {products.length > 0 ? (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="text-success fw-bold">${product.price.toFixed(2)}</p>
                  <p className="card-text text-truncate">{product.description}</p>

                  {user?.role === "client" && (
                    <button
                      onClick={() => addToCart(product._id)}
                      className="btn btn-success mt-auto"
                    >
                      Add to Cart
                    </button>
                  )}

                  {user?.role === "admin" && (
                    <span className="text-muted mt-auto d-block text-center">
                      Admins cannot order
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">No products found.</p>
      )}
    </div>
  );
};

export default Home;
