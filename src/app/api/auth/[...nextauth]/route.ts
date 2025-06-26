import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.API_URL_BASE}/api/login/`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            credentials: 'include',
            mode: 'cors'
          })

          if (!res.ok) {
            // Si hay un error de CORS, lanzar un error específico
            if (res.status === 0 || res.type === 'opaque') {
              throw new Error('CORS_ERROR: No se puede acceder al servidor de autenticación');
            }
            const error = await res.json();
            throw new Error(error.message || 'Error de autenticación');
          }

          const user = await res.json()

          if (user) {
            return user
          }
          return null
        } catch (error) {
          console.error("Error during authorization:", error);
          // Propagar el error para que NextAuth lo maneje
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hora en segundos
  },
  pages: {
    signIn: '/login',
    error: '/login', // Página a la que redirigir en caso de error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access = user.access
        token.refresh = user.refresh
        token.user = user.user
        token.accessTokenExpires = Date.now() + (60 * 1000)
      }

      // Si el token no ha expirado, devuélvelo
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // Si el token ha expirado, intenta refrescarlo
      try {
        const refreshedToken = await refreshAccessToken(token);
        return refreshedToken;
      } catch (error) {
        console.error("Error refreshing token:", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },
    async session({ session, token }) {
      session.user = token;

      // Si hay error de token, la sesión no es válida
      if (token.error === "RefreshAccessTokenError") {
        return null; // Esto forzará la redirección al login
      }

      return session;
    }
  },
  events: {
    async signOut() {
      // Limpiar cualquier estado o caché cuando el usuario cierre sesión
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    },
    async error(error) {
      console.error("NextAuth error:", error);
      // Si es un error de CORS, redirigir a una página específica
      if (error.message?.includes('CORS_ERROR')) {
        return '/error/cors';
      }
    }
  }
}

async function refreshAccessToken(token) {
  try {
    const res = await fetch(`${process.env.API_URL_BASE}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        refresh: token.refresh
      }),
      credentials: 'include',
      mode: 'cors'
    })

    if (!res.ok) {
      // Si hay un error de CORS, lanzar un error específico
      if (res.status === 0 || res.type === 'opaque') {
        throw new Error('CORS_ERROR: No se puede acceder al servidor de autenticación');
      }
      throw new Error("Failed to refresh token");
    }

    const refreshedTokens = await res.json()
    
    return {
      ...token,
      access: refreshedTokens.access,
      accessTokenExpires: Date.now() + (60 * 1000),
      refresh: refreshedTokens.refresh ?? token.refresh,
    }
  } catch (error) {
    console.error("Error refreshing access token", error)
    throw error; // Propagar el error para que sea manejado por el callback
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }