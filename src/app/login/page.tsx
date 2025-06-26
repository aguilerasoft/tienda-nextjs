"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Usuario o contraseña incorrectos");
      setSuccess("");
      setTimeout(() => setError(""), 6000);
    } else {
      setSuccess("¡Inicio de sesión exitoso!");
      setError("");
      setTimeout(() => {
        window.location.href = "/home";
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center px-6 py-12">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-xl max-w-md w-full p-10 border border-purple-200">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center tracking-wide">
          Bienvenido a <span className="text-pink-500">TuTienda</span>
        </h1>

        {(error || success) && (
          <div
            className={`mb-6 px-5 py-3 rounded-lg text-center font-semibold ${
              error
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
            role="alert"
          >
            {error || success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Usuario */}
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-purple-700"
            >
              Usuario
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                placeholder="ejemplo@correo.com"
                className="w-full rounded-xl border border-purple-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-300 transition"
                autoComplete="username"
              />
              <svg
                className="w-5 h-5 text-purple-400 absolute top-3 right-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14v7"
                />
              </svg>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-purple-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-purple-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-300 transition"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-purple-500 hover:text-pink-500 focus:outline-none"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9 0-1.03.18-2.015.5-2.927m2.375-2.375A9.956 9.956 0 0112 5c5 0 9 4 9 9 0 1.03-.18 2.015-.5 2.927m-2.375 2.375L4.5 4.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl font-bold text-white shadow-lg transition-colors ${
              loading
                ? "bg-pink-300 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-8 text-center text-purple-700 text-sm">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="font-semibold text-pink-500 hover:underline"
          >
            Regístrate aquí
          </a>
        </div>

        <p className="mt-6 text-center text-purple-400 text-xs">
          ¿Necesitas ayuda?{" "}
          <a href="mailto:soporte@tutienda.com" className="hover:underline">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}
