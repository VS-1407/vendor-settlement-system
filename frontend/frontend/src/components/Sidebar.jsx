import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Vendors",
    path: "/vendors",
    icon: Users,
  },
  {
    title: "Settlements",
    path: "/settlements",
    icon: Wallet,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-900 dark:bg-gray-950 text-white shadow-2xl border-r border-slate-800 dark:border-gray-800 transition-colors duration-300">

      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800 dark:border-gray-800">

        <div className="text-center">

          <h1 className="text-3xl font-extrabold tracking-wide text-blue-400">
            VendorPay
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Admin Dashboard
          </p>

        </div>

      </div>

      {/* Navigation */}

      <nav className="mt-8 px-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3 rounded-xl mb-3 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-[1.02]"
                    : "text-slate-300 hover:bg-slate-800 dark:hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon
                size={22}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              <span className="font-medium tracking-wide">
                {item.title}
              </span>

            </NavLink>
          );
        })}

      </nav>

      {/* Footer */}

      <div className="absolute bottom-6 left-0 w-full px-6">

        <div className="border-t border-slate-800 dark:border-gray-800 pt-5">

          <p className="text-center text-xs text-slate-500">
            VendorPay v1.0
          </p>

        </div>

      </div>

    </aside>
  );
}