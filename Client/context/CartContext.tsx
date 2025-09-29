import { createContext, PropsWithChildren, useContext, useState } from "react";
import type { Cart } from "../src/model/ICart";

interface CartContextValue {
  cart: Cart | null;
  setCart: (cart:Cart)=>void;
  
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCartContext() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCartContext must be used inside a CartContextProvider");
  }

  return context;
}

export function CartContextProvider({ children }: PropsWithChildren<any>) {
  const [cart, setCart] = useState<Cart | null>(null);

  

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

