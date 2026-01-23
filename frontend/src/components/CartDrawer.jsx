import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    address: "",
    comment: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return alert("Кошик пустий");

    setLoading(true);

    const payload = {
      name: form.name,
      surname: form.surname,
      phone: form.phone,
      address: form.address,
      comment: form.comment,
      items: items.map((i) => ({
        product: i.product.id,
        quantity: i.quantity,
      })),
    };

    try {
      const res = await fetch(`${API_URL}/api/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err ? JSON.stringify(err) : `HTTP ${res.status}`);
      }

      const data = await res.json();
      setSuccess(data);
      clearCart();
    } catch (err) {
      console.error("Checkout error", err);
      alert("Не вдалося оформити замовлення. Перевір дані та спробуй ще.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-60 transition-transform ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* затемнення */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b shrink-0">
          <h3 className="text-xl font-semibold">Кошик</h3>
          <button onClick={onClose} className="text-gray-600">
            ✕
          </button>
        </div>

        {/* Список товарів — СКРОЛИТЬСЯ */}
        <div className="p-4 overflow-auto flex-1">
          {items.length === 0 ? (
            <p className="text-gray-500">Кошик порожній</p>
          ) : (
            items.map((it) => (
              <div
                key={it.product.id}
                className="flex gap-3 items-center mb-4"
              >
                <img
                  src={
                    it.product.image?.trim() ||
                    "https://via.placeholder.com/80"
                  }
                  alt=""
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <div className="font-medium">{it.product.name}</div>
                  <div className="text-sm text-gray-600">
                    {parseFloat(it.product.price).toFixed(2)} грн
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          it.product.id,
                          Math.max(1, parseInt(e.target.value || 1))
                        )
                      }
                      className="w-16 p-1 border rounded"
                    />

                    <button
                      className="text-sm text-red-500"
                      onClick={() => removeFromCart(it.product.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Нижній блок — ЗАВЖДИ ВИДИМИЙ */}
        <div className="p-4 border-t shrink-0 bg-white">
          <div className="flex justify-between mb-3">
            <span className="font-medium">Разом</span>
            <span className="font-bold">{total.toFixed(2)} грн</span>
          </div>

          {success ? (
            <div className="p-3 bg-green-50 border rounded">
              <div className="font-semibold">
                Дякуємо! Замовлення оформлено.
              </div>
              <div className="text-sm mt-2">
                Номер замовлення: {success.id}
              </div>
              <button
                className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded w-full"
                onClick={() => {
                  setSuccess(null);
                  onClose();
                }}
              >
                Закрити
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ім'я"
                className="w-full p-2 border rounded"
              />

              <input
                name="surname"
                value={form.surname}
                onChange={handleChange}
                required
                placeholder="Фамілія"
                className="w-full p-2 border rounded"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Телефон"
                className="w-full p-2 border rounded"
              />

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Адреса (Нова пошта)"
                className="w-full p-2 border rounded"
              />

              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Коментар (необов'язково)"
                className="w-full p-2 border rounded h-20 resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded"
              >
                {loading
                  ? "Оформлюємо..."
                  : `Оформити — ${total.toFixed(2)} грн`}
              </button>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;

