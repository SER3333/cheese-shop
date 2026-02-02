// HomePage.jsx (SEO-fixed + production-ready)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ProductCard from "../components/ProductCard";

/* =======================
   CATEGORY MAPS
======================= */

// URL slug -> backend category
const categorySlugMap = {
  siry: "cheese",
  dzhemy: "jam",
  // soky: "juice", ❌ тимчасово прибрано
};

// backend category -> UI label
const categoryLabelMap = {
  cheese: "Сири",
  jam: "Джеми",
  // juice: "Соки", ❌ тимчасово прибрано
};

/* =======================
   SEO CONFIG
======================= */

const seoMap = {
  siry: {
    title: "Купити крафтовий сир — крафтові сири без хімії",
    description:
      "Купити крафтовий фермерський сир з натурального молока. Твердий і мʼякий сир без консервантів. Доставка по Україні.",
    h1: "Купити крафтовий сир",
    text:
      "У нашій крафтовій лавці ви можете купити крафтовий сир з натурального фермерського молока. Ми пропонуємо твердий та мʼякий сир без хімії, консервантів і пальмової олії.",
  },
  dzhemy: {
    title: "Купити натуральний джем — домашні джеми без консервантів",
    description:
      "Купити домашні натуральні джеми з ягід та фруктів. Без консервантів, барвників та штучних добавок.",
    h1: "Купити натуральний джем",
    text:
      "Пропонуємо купити натуральні домашні джеми з фермерських ягід і фруктів. Наші крафтові джеми виготовляються без консервантів.",
  },

  // soky: { ❌ тимчасово прибрано
  //   title: "Купити натуральний сік — сік прямого віджиму без цукру",
  //   description:
  //     "Купити натуральні соки прямого віджиму без цукру, води та консервантів. Фермерські фрукти та ягоди.",
  //   h1: "Купити натуральний сік",
  //   text:
  //     "У нас ви можете купити натуральний сік прямого віджиму без цукру та консервантів. Крафтові соки з доставкою по Україні.",
  // },

  default: {
    title:
      "Крафтова лавка — купити крафтові продукти | Сири та джеми",
    description:
      "Купити крафтові продукти: крафтові сири без хімії та натуральні джеми. Доставка по Україні.",
    h1: "Купити крафтові продукти",
    text:
      "Ми пропонуємо купити крафтові продукти напряму від виробника: крафтові сири та натуральні джеми без консервантів.",
  },
};

/* =======================
   COMPONENT
======================= */

const HomePage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const backendCategory = categorySlugMap[category];
  const seo = seoMap[category] || seoMap.default;

  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/`)
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((i) => i.id === product.id);

    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const filteredProducts = backendCategory
    ? products.filter(
        (p) =>
          p.category === backendCategory ||
          p.category === categoryLabelMap[backendCategory]
      )
    : products;

  const canonicalUrl = `https://craftova-lavka.com${
    category ? `/${category}` : ""
  }`;

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* SEO */}
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      {/* HERO */}
      <section className="relative w-full h-[45vh] sm:h-[55vh] md:h-[75vh] flex items-center justify-center">
        <img
          src="/images/hero-cheese3.png"
          alt="Крафтові сири та джеми"
          className="max-h-full max-w-full px-4 object-contain"
          loading="eager"
        />
      </section>

      {/* H1 + SEO TEXT */}
      <section className="max-w-4xl mx-auto px-4 text-center my-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{seo.h1}</h1>
        <p className="text-gray-700">{seo.text}</p>
      </section>

      {/* CATEGORY FILTER */}
      <div className="my-6 px-4 flex justify-center">
        <div className="flex gap-3 overflow-x-auto max-w-full">
          {[
            { label: "Все", path: "/" },
            { label: "Сири", path: "/siry" },
            { label: "Джеми", path: "/dzhemy" },
            // { label: "Соки", path: "/soky" }, ❌ тимчасово
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg transition ${
                (!category && path === "/") || path === `/${category}`
                  ? "bg-yellow-600 text-white"
                  : "bg-yellow-200 hover:bg-yellow-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.slice(0, visibleCount).map((p) => (
          <div key={p.id} className="flex justify-center w-full">
            <ProductCard product={p} addToCart={addToCart} />
          </div>
        ))}
      </main>

      {/* LOAD MORE */}
      {visibleCount < filteredProducts.length && (
        <div className="flex justify-center pb-8">
          <button
            onClick={() => setVisibleCount((v) => v + 6)}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Показати ще
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;




