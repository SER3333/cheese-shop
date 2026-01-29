import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);

  const images = [
    product.image,
    ...(product.images?.map((i) => i.image) || []),
  ].filter(Boolean);

  const next = () => setImgIndex((p) => (p + 1) % images.length);
  const prev = () => setImgIndex((p) => (p - 1 + images.length) % images.length);

  /* ===== SWIPE ===== */
  const startX = useRef(0);
  const endX = useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = startX.current - endX.current;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  return (
    <div className="
      bg-white rounded-2xl shadow-md p-4
      w-full max-w-[360px]
      flex flex-col
    ">
      {/* IMAGE */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative"
      >
        <Link to={`/product/${product.slug}`}>
          <img
            src={images[imgIndex]}
            alt={product.name}
            loading="lazy"
            className="
              w-full
              h-44 sm:h-48 md:h-52
              object-cover
              rounded-xl
            "
          />
        </Link>

        {/* ARROWS (desktop only) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="
                hidden md:flex
                absolute left-2 top-1/2 -translate-y-1/2
                bg-yellow-500/80 hover:bg-yellow-600
                text-white w-9 h-9 rounded-full
                shadow-lg backdrop-blur-sm
                items-center justify-center
              "
            >
              ‹
            </button>

            <button
              onClick={next}
              className="
                hidden md:flex
                absolute right-2 top-1/2 -translate-y-1/2
                bg-yellow-500/80 hover:bg-yellow-600
                text-white w-9 h-9 rounded-full
                shadow-lg backdrop-blur-sm
                items-center justify-center
              "
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* CONTENT */}
      <Link to={`/product/${product.slug}`} className="flex-1">
        <h3 className="text-lg md:text-xl font-semibold mt-3 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {product.short_description}
        </p>
      </Link>

      {/* META */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-yellow-800 font-semibold text-sm">
          {product.size}
        </span>
        <span className="text-yellow-800 font-bold text-xl md:text-2xl">
          {product.price} грн
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={() => addToCart(product)}
        className="
          mt-4
          bg-yellow-600 hover:bg-yellow-700
          text-white font-medium
          px-4 py-2
          rounded-xl
          w-full
          transition
        "
      >
        Додати в кошик
      </button>
    </div>
  );
};

export default ProductCard;

