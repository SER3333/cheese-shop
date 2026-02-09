import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-yellow-100 mt-12 border-t border-yellow-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ЛОГО + ОПИС */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/images/logo.png"
              alt="Крафтова лавка — фермерські сири, джеми та соки"
              className="w-14 h-14 rounded-xl shadow"
            />
            <h2 className="text-2xl font-bold text-yellow-800">
              Крафтова лавка
            </h2>
          </div>
          <p className="text-yellow-700 text-sm">
            Натуральні крафтові сири, джеми та соки.
            Чистий смак. Жодної хімії.
          </p>
        </div>

        {/* МЕНЮ */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Меню</h3>
          <ul className="flex flex-col gap-2 text-yellow-700">
            <Link to="/" className="hover:text-yellow-900">Головна</Link>
            <Link to="/siry" className="hover:text-yellow-900">Сири</Link>
            <Link to="/dzhemy" className="hover:text-yellow-900">Джеми</Link>
            <Link to="/soky" className="hover:text-yellow-900">Соки</Link>
            <Link to="/pro-nas" className="hover:text-yellow-900">Про нас</Link>
          </ul>
        </div>

        {/* КОНТАКТИ */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Контакти</h3>
          <ul className="flex flex-col gap-2 text-yellow-700">
            <li>
              <a
                href="https://t.me/your_telegram"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-900"
              >
                📲 Telegram:
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/craftova_lavka_?igsh=MXRqbjl3ZzhsMGhxcg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-900"
              >
                📸 Instagram
              </a>
            </li>
            <li className="text-sm text-yellow-600">
              📍 Івано-Франківськ, Україна
            </li>
          </ul>
        </div>

      </div>

      {/* ПІДВАЛ */}
      <div className="text-center py-4 bg-yellow-200 text-yellow-800 text-sm border-t border-yellow-300">
        © {new Date().getFullYear()} Крафтова лавка — всі права захищені.
      </div>
    </footer>
  );
};

export default Footer;
