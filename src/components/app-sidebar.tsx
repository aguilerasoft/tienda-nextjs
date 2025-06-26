"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiGrid,
  FiUsers,
  FiMail,
  FiSettings,
  FiHelpCircle,
  FiSearch,
  FiBell,
  FiMessageSquare,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiLock
} from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";

const WavySidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar sidebar en móvil al cambiar de ruta
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [pathname]);

  // Cerrar sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");

      if (sidebar && !sidebar.contains(event.target as Node) &&
        menuButton && !menuButton.contains(event.target as Node)) {
        setIsOpen(false);
      }

      // Cerrar dropdown de usuario si se hace clic fuera
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, userDropdownOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const mainNavItems = [
    { href: "/home", label: "Inicio", icon: <RiDashboardLine className="text-lg" /> },


  ];

  const ProductoNavItems = [
    { href: "/producto", label: "Productos", icon: <FiGrid className="text-lg" /> }, 
    { href: "/producto/categoria", label: "Categorias", icon: <FiGrid className="text-lg" /> },
    { href: "/producto/talla", label: "Tallas", icon: <FiUsers className="text-lg" /> },
    { href: "/producto/color", label: "Colores", icon: <FiMail className="text-lg" /> },

  ];


  const adminNavItems = [
    { href: "/settings", label: "Configuracion", icon: <FiSettings className="text-lg" /> },
    { href: "/help", label: "Help Center", icon: <FiHelpCircle className="text-lg" /> },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-30 flex items-center px-4 lg:pl-64">
        <div className="flex items-center justify-between w-full">
          {/* Mobile menu button */}
          <button
            id="menu-button"
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-50 transition-all"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-md px-3 py-2 ml-4 flex-1 max-w-md">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none w-full text-gray-600 placeholder-gray-400 text-sm"
            />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-3 ml-auto">
            <button className="p-2 rounded-md hover:bg-gray-50 relative text-gray-500">
              <FiMessageSquare className="" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            <button className="p-2 rounded-md hover:bg-gray-50 relative text-gray-500">
              <FiBell className="" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>

            {/* User profile with dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="flex items-center ml-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">US</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:inline">User Name</span>
                <FiChevronDown className={`ml-1 text-gray-400 hidden lg:block transition-transform ${userDropdownOpen ? 'transform rotate-180' : ''}`} size={16} />
              </button>

              {/* User dropdown menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">Usuario Administrador</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiUser className="mr-3" size={14} />
                    Mi perfil
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiSettings className="mr-3" size={14} />
                    Configuración
                  </Link>
                  <Link
                    href="/password"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLock className="mr-3" size={14} />
                    Cambiar contraseña
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => console.log("Cerrar sesión")}
                  >
                    <FiLogOut className="mr-3" size={14} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - Azul Marino */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full bg-slate-900 shadow-sm z-40 border-r border-blue-900
                    transform transition-all duration-200 ease-in-out
                    ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-64"}`}
      >
        {/* Logo section - Azul más oscuro para contraste */}
        <div className="px-6 py-4 border-b border-blue-900 bg-blue-900">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow">
              <svg className="w-6 h-6 text-blue-800" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-white">Company</h2>
              <p className="text-xs text-blue-200">Business Suite</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full overflow-y-auto" style={{ height: 'calc(100vh - 4rem - 68px)' }}>
          {/* Navigation menu */}
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {/* Main navigation items */}
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-md transition-colors
                      ${pathname === item.href
                        ? "bg-blue-700 text-white font-medium"
                        : "hover:bg-blue-700/50 text-blue-100"}`}
                  >
                    <span className={`${pathname === item.href ? "text-white" : "text-blue-300"}`}>
                      {item.icon}
                    </span>
                    <span className="ml-3 text-sm">
                      {item.label}
                    </span>
                    {pathname === item.href && (
                      <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </Link>
                </li>
              ))}

              <li className="px-3 py-2 mt-4 mb-2 relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <hr className="w-full border-blue-700/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 text-xs font-semibold uppercase tracking-wider text-blue-200/80 bg-slate-900">
                    Producto
                  </span>
                </div>
              </li>
              {ProductoNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-md transition-colors
                      ${pathname === item.href
                        ? "bg-blue-700 text-white font-medium"
                        : "hover:bg-blue-700/50 text-blue-100"}`}
                  >
                    <span className={`${pathname === item.href ? "text-white" : "text-blue-300"}`}>
                      {item.icon}
                    </span>
                    <span className="ml-3 text-sm">
                      {item.label}
                    </span>
                    {pathname === item.href && (
                      <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </Link>
                </li>
              ))}
              {/* Separator for admin section */}
              <li className="px-3 py-2">
                <hr className="border-blue-700" />
              </li>

              {/* Admin navigation items */}
              {adminNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-md transition-colors
                      ${pathname === item.href
                        ? "bg-blue-700 text-white font-medium"
                        : "hover:bg-blue-700/50 text-blue-100"}`}
                  >
                    <span className={`${pathname === item.href ? "text-white" : "text-blue-300"}`}>
                      {item.icon}
                    </span>
                    <span className="ml-3 text-sm">
                      {item.label}
                    </span>
                    {pathname === item.href && (
                      <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile at bottom */}

        </div>
      </aside>
    </>
  );
};

export default WavySidebar;