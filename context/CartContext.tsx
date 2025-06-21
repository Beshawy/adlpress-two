"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of a cart item
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Define the shape of the context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

const staticInitialItems: CartItem[] = [
  {
    id: 1,
    name: "ساعة ذكية",
    price: 250.0,
    quantity: 1,
    image: "/icons/watch.png",
  },
];

// Create a provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];

      // If the cart from localStorage is empty, initialize with static data for testing.
      if (parsedCart.length === 0) {
        setCartItems(staticInitialItems);
      } else {
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      // Fallback to static data in case of any error
      setCartItems(staticInitialItems);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prevItems.filter((i) => i.id !== id);
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
        getCartTotal,
        isCartOpen,
        toggleCart,
        openCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}; 