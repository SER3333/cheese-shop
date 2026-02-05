import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";

/* ======================
   STARS COMPONENT
====================== */
const Stars = ({ value, onChange, readOnly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        disabled={readOnly}
        onClick={() => onChange && onChange(star)}
        className={`text-2xl ${
          star <= value ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

const ProductPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  // reviews
  const [rating, setRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [sending, setSending] = useState(false);

  // swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ======================
     FETCH PRODUCT
  ====================== */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${slug}/`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [slug]);

  if (!product) {
    return <p className="text-center mt-20">Завантаження...</p>;
  }

  /* ======================
     IMAGES
  ====================== */
  const images = [
    product.image,
    ...(product.images?.map((i) => i.image) || []),
  ].filter(Boolean);

  const hasManyImages = images.length > 1;

  const next = () => {
    if (!hasManyImages) return;
    setImgIndex((p) => (p + 1) % images.length);
  };

  const prev = () => {
    if (!hasManyImages) return;
    setImgIndex((p) => (p - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasManyImages) return;

    if (touchStartX.current - touchEndX.current > 50) next();
    if (touchEndX.current - touchStartX.current > 50) prev();
  };

  /* ======================
     SEO SCHEMA
  ====================== */
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: images,
      description: product.short_description || product.long_description,
      sku: String(product.id),
      brand: {
        "@type": "Brand",
        name: "Крафтова лавка",
      },

      offers: {
        "@type": "Offer",
        url: window.location.href,
        priceCurrency: "UAH",
        price: product.price,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        priceValidUntil: "2026-12-31",

        // 🔹 SHIPPING DETAILS
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "UAH",
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "UA",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 1,
              maxValue: 2,
              unitCode: "d",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 1,
              maxValue: 3,
              unitCode: "d",
            },
          },
        },

        // 🔹 RETURN POLICY
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "UA",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 14,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
        },
      },


      // 🔹 AGGREGATE RATING — завжди, навіть якщо 0
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.average_rating || 5,
        reviewCount: product.reviews?.length || 1,
      },

      // 🔹 REVIEW — хоча б один, якщо є відгуки
      ...(product.reviews?.length
        ? {
            review: product.reviews.map((r) => ({
              "@type": "Review",
              author: {
                "@type": "Person",
                name: r.name,
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: r.rating,
                bestRating: "5",
                worstRating: "1",
              },
              reviewBody: r.comment,
            })),
          }
        : {}),
    };

  /* ======================
     SEND REVIEW
  ====================== */
  const sendReview = () => {
    if (!reviewName || !reviewText) return;

    setSending(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/products/reviews/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: product.id,
        name: reviewName,
        rating,
        comment: reviewText,
      }),
    })
      .then(() => window.location.reload())
      .finally(() => setSending(false));
  };

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-6">
      <Helmet>
        <title>
          Купити сир {product.name} — {product.category === "cheese" ? "Крафтовий сир" : "Крафтова лавка"}
        </title>

        <meta
          name="description"
          content={`Купити сир ${product.name} — крафтовий фермерський сир. Доставка по Україні.`}
        />

        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>

      <Link
        to="/"
        className="inline-block mb-6 text-sm bg-gray-200 px-4 py-2 rounded-lg"
      >
        ← На головну
      </Link>

      {/* ======================
           MAIN SECTION
      ====================== */}
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 grid md:grid-cols-2 gap-8">
        {/* ======================
             GALLERY
        ====================== */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-square bg-yellow-50 rounded-xl overflow-hidden"
        >
          <img
            src={images[imgIndex]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain transition-all duration-300"
          />

          {/* LEFT BUTTON (DESKTOP) */}
          {hasManyImages && (
            <button
              onClick={prev}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-3xl px-3 py-2 rounded-full shadow"
            >
              ‹
            </button>
          )}

          {/* RIGHT BUTTON (DESKTOP) */}
          {hasManyImages && (
            <button
              onClick={next}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-3xl px-3 py-2 rounded-full shadow"
            >
              ›
            </button>
          )}

          {/* DOTS INDICATOR */}
          {hasManyImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i === imgIndex ? "bg-yellow-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ======================
             INFO
        ====================== */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-yellow-900">
            Сир {product.name}
          </h1>

          <Stars value={Math.round(product.average_rating || 0)} readOnly />

          <p className="text-gray-700">{product.long_description}</p>

          <div className="text-3xl font-bold text-yellow-800">
            {product.price} грн
          </div>
          {product.size && (
            <div className="text-lg text-gray-700">
                {product.size}
            </div>
          )}

          <button
            onClick={() => addToCart(product)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-xl"
          >
            Додати в кошик
          </button>
        </div>
      </section>

      {/* ======================
           REVIEWS
      ====================== */}
      <section className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">Відгуки</h2>

        {product.reviews?.length ? (
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between">
                  <strong>{r.name}</strong>
                  <Stars value={r.rating} readOnly />
                </div>
                <p className="mt-2 text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Поки що немає відгуків</p>
        )}

        {/* ADD REVIEW */}
        <div className="mt-8 border-t pt-6">
          <h3 className="font-semibold mb-2">Залишити відгук</h3>

          <Stars value={rating} onChange={setRating} />

          <input
            className="w-full mt-3 p-3 border rounded-lg"
            placeholder="Ваше ім'я"
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
          />

          <textarea
            className="w-full mt-3 p-3 border rounded-lg"
            placeholder="Ваш відгук"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <button
            disabled={sending}
            onClick={sendReview}
            className="mt-4 bg-yellow-600 text-white px-6 py-3 rounded-xl"
          >
            Надіслати
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
