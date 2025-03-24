import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../Firebase/Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fetch cart data when user logs in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch cart data from Firestore
        const cartRef = doc(firestore, "carts", user.uid);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          setCart(cartDoc.data().items || []);
        }
      } else {
        setCart([]); // Clear cart when user logs out
      }
    });

    return () => unsubscribe();
  }, []);

  // Update Firestore whenever cart changes
  const updateFirestoreCart = async (newCart) => {
    const user = auth.currentUser;
    if (user) {
      const cartRef = doc(firestore, "carts", user.uid);
      await setDoc(cartRef, { items: newCart }, { merge: true });
    }
  };

  const addToCart = async (hotel) => {
    const newCart = [...cart, hotel];
    setCart(newCart);
    await updateFirestoreCart(newCart);
  };

  const removeFromCart = async (hotelId) => {
    const newCart = cart.filter((item) => item.id !== hotelId);
    setCart(newCart);
    await updateFirestoreCart(newCart);
  };

  const clearCart = async () => {
    setCart([]);
    const user = auth.currentUser;
    if (user) {
      const cartRef = doc(firestore, "carts", user.uid);
      await setDoc(cartRef, { items: [] }, { merge: true });
    }
  };

  // const totalPrice = cart.reduce((total, hotel) => {
  //   const price = typeof hotel.price === 'object' ? hotel.price.amount : hotel.price;
  //   return total + (Number(price) || 0);
  // }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

