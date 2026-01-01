import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-yellow-100 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        {/* ЛОГО + НАЗВА */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Крафтова лавка — фермерські продукти"
            className="w-14 h-14 object-contain rounded-xl shadow"
          />
          <span className="text-2xl font-bold text-yellow-800 tracking-wide">
            Крафтова лавка
          </span>
        </Link>

        {/* МЕНЮ */}
        <nav className="hidden md:flex gap-6">
          <Link className="text-yellow-700 hover:text-yellow-900" to="/">
            Головна
          </Link>
          <Link className="text-yellow-700 hover:text-yellow-900" to="/siry">
            Сири
          </Link>
          <Link className="text-yellow-700 hover:text-yellow-900" to="/dzhemy">
            Джеми
          </Link>
          <Link className="text-yellow-700 hover:text-yellow-900" to="/soky">
            Соки
          </Link>
          <Link className="text-yellow-700 hover:text-yellow-900" to="/pro-nas">
            Про нас
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default Header;

