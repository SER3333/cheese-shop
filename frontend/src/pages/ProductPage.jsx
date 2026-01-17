import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";

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

  if (!product) {
    return <p className="text-center mt-20">Завантаження...</p>;
  }

  /* ======================
     GALLERY
  ====================== */
  const images = [
    product.image,
    ...(product.images?.map((i) => i.image) || []),
  ].filter(Boolean);

  const next = () => setImgIndex((p) => (p + 1) % images.length);
  const prev = () => setImgIndex((p) => (p - 1 + images.length) % images.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) next();
    if (touchEndX.current - touchStartX.current > 50) prev();
  };

  /* ======================
     SEO
  ====================== */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.short_description || product.long_description,
    sku: product.id,
    brand: { "@type": "Brand", name: "Крафтова лавка" },
    offers: {
      "@type": "Offer",
      priceCurrency: "UAH",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: product.average_rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.average_rating,
          reviewCount: product.reviews?.length || 0,
        }
      : undefined,
  };

  /* ======================
     SEND REVIEW
  ====================== */
  const sendReview = () => {
    if (!reviewName || !reviewText) return;

    setSending(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/reviews/create/`, {
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
        <title>Купити {product.name} — Крафтова лавка</title>
        <meta
          name="description"
          content={`Купити ${product.name}. Натуральний фермерський продукт. Доставка по Україні.`}
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

      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 grid md:grid-cols-2 gap-8">
        {/* GALLERY */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-square bg-yellow-50 rounded-xl"
        >
          <img
            src={images[imgIndex]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-yellow-900">
            {product.name}
          </h1>

          <Stars value={Math.round(product.average_rating || 0)} readOnly />

          <p className="text-gray-700">{product.long_description}</p>

          <div className="text-3xl font-bold text-yellow-800">
            {product.price} грн
          </div>

          <button
            onClick={() => addToCart(product)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-xl"
          >
            Додати в кошик
          </button>
        </div>
      </section>

      {/* REVIEWS */}
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


