import axios from "axios";
import { CarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CartItem {
  id: String;
  productId: Number;
  title: String;
  rating: Number;
  brand: String;
  category: String;
  price: Number;
  discountPercentage: Number;
  description: String;
  stock: Number;
  quantity: Number;
  addedAt: Date;
}

const page = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/cart");
      setCartItems(response.data.data);
    } catch (error) {
      console.log("Failed to load cart items", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) return <div>Loading cart...</div>;

  return (
    <section>
      <div className="cart">
        <h1>My Cart</h1>
      </div>

      <div className="cart-items">
        <h2>Your Cart {cartItems.length} </h2>
        <div className="grid">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="item">
              {cartItems.map((item, index) => (
                <li key={index}>
                  <p></p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default page;
