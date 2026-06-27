import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();

  const { darkMode, setDarkMode } = useTheme();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 h-20 px-8 flex justify-between items-center shadow-sm transition-colors">

      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Vendor Settlement Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-5">

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition flex items-center justify-center"
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-gray-700" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative">

          <Bell
            size={22}
            className="text-gray-600 dark:text-gray-300"
          />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>

        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </header>
  );
}