import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const API_BASE = "http://localhost:5000/api";

  // 1. Initial Load: Sync User from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setUserLoaded(true);
  }, []);

  // 2. Cross-Tab Sync
  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // 3. Fetch Data from .NET Backend
  useEffect(() => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      return;
    }

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // Fetch Cart - Endpoint matches your CartController route
    axios.get(`${API_BASE}/cart`, config)
      .then(res => {
        // res.data.data matches your ApiResponse wrapper structure
        setCart(res.data.data || []);
      })
      .catch((err) => {
        console.error("Cart fetch error:", err);
        setCart([]);
      });

    // Fetch Wishlist - Endpoint matches your WishlistController route
    axios.get(`${API_BASE}/wishlist`, config)
      .then(res => {
        setWishlist(res.data.data || []);
      })
      .catch((err) => {
        console.error("Wishlist fetch error:", err);
        setWishlist([]);
      });
  }, [user]);

  return (
    <CartContext.Provider value={{
      cart, setCart, wishlist, setWishlist, user, setUser, userLoaded
    }}>
      {children}
    </CartContext.Provider>
  );
}