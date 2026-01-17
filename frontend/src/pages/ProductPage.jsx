import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";

const ProductPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  const categoryMap = {
      cheese: { name: "Сири", slug: "siry" },
      jam: { name: "Джеми", slug: "dzhemy" },
      juice: { name: "Соки", slug: "soky" },
  };

  /* ======================
     FETCH PRODUCT
  ====================== */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${slug}/`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [slug]);

  if (!product)
    return <p className="text-center mt-20">Завантаження...</p>;

  /* ======================
     SEO SCHEMA
  ====================== */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image ? [product.image] : undefined,
    description: product.short_description || product.long_description,
    sku: product.id,
    brand: { "@type": "Brand", name: "Крафтова лавка" },
    offers: {
      "@type": "Offer",
      url: typeof window !== "undefined" ? window.location.href : "",
      priceCurrency: "UAH",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const images = [
    product.image,
    ...(product.images?.map((i) => i.image) || []),
  ].filter(Boolean);

  const next = () => setImgIndex((p) => (p + 1) % images.length);
  const prev = () => setImgIndex((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-6 md:px-6">
      {/* SEO */}
      <Helmet>
          <title>Купити {product.name} — натуральний крафтовий продукт</title>

          <meta
            name="description"
            content={`Купити ${product.name}. Натуральний фермерський продукт без хімії та консервантів. Доставка по Україні.`}
          />

          {/* Product schema */}
          <script type="application/ld+json">
            {JSON.stringify(productSchema)}
          </script>

          {/* Breadcrumbs schema */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Головна",
                  "item": window.location.origin + "/"
                },
                product.category && categoryMap[product.category]
                  ? {
                      "@type": "ListItem",
                      "position": 2,
                      "name": categoryMap[product.category].name,
                      "item":
                        window.location.origin +
                        "/" +
                        categoryMap[product.category].slug
                    }
                  : null,
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": product.name,
                  "item": window.location.href
                }
              ].filter(Boolean)
            })}
          </script>
      </Helmet>



      {/* BACK */}
      <Link
        to="/"
        className="inline-block mb-6 text-sm bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        ← На головну
      </Link>

      {/* PRODUCT */}
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* GALLERY */}
        <div className="relative">
          <div className="relative w-full aspect-square bg-yellow-50 rounded-xl">
            <img
              src={images[imgIndex]}
              alt={`Купити ${product.name}`}
              className="absolute inset-0 w-full h-full object-contain rounded-xl"
              loading="eager"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2
                  bg-yellow-500/80 hover:bg-yellow-600 text-white
                  w-10 h-10 rounded-full shadow-lg
                  items-center justify-center"
                >
                  ‹
                </button>

                <button
                  onClick={next}
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2
                  bg-yellow-500/80 hover:bg-yellow-600 text-white
                  w-10 h-10 rounded-full shadow-lg
                  items-center justify-center"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* THUMBNAILS (desktop) */}
          {images.length > 1 && (
            <div className="hidden sm:flex gap-3 mt-4 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-16 h-16 rounded-lg border-2 ${
                    i === imgIndex
                      ? "border-yellow-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-900">
            {product.name}
          </h1>

          <p className="text-gray-700 leading-relaxed">
            {product.long_description}
          </p>

          <div className="text-3xl font-bold text-yellow-800">
            {product.price} грн
          </div>

          <button
            onClick={() => addToCart(product)}
            className="
              mt-2
              w-full sm:w-auto
              bg-yellow-600 hover:bg-yellow-700
              text-white font-semibold
              px-8 py-3
              rounded-xl
              transition
            "
          >
            Додати в кошик
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;


