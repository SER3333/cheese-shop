// App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartIcon from "./components/CartIcon";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";
import AboutPage from "./pages/AboutPage";


function App() {
  const [open, setOpen] = useState(false);

  return (
    <CartProvider>
      <Header />
      <CartIcon onOpen={() => setOpen(true)} />
      <CartDrawer isOpen={open} onClose={() => setOpen(false)} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:category" element={<HomePage />} /> {/* SEO categories */}
        <Route path="/product/:slug" element={<ProductPage />} /> {/* SEO-friendly slug */}
        <Route path="/pro-nas" element={<AboutPage />} />
      </Routes>

      <Footer />
    </CartProvider>
  );
}

export default App;


