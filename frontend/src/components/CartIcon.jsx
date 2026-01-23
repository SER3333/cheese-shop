import React from "react";
import { useCart } from "../context/CartContext";

const CartIcon = ({ onOpen }) => {
  const { items, total } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <button
      onClick={onOpen}
      className="fixed right-4 bottom-6 z-40 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
      <span className="font-medium">{count}</span>
      <span className="text-sm opacity-80">{total.toFixed(0)} грн</span>
    </button>
  );
};

export default CartIcon;
