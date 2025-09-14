import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

interface NextAuthJWT {
  id: string;
  email: string;
  name: string;
  picture?: string;
  iat?: number;
  exp?: number;
}

// Helper to parse cookies from socket headers
function parseCookies(
  cookieHeader: string | undefined
): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (!name) return;
    cookies[name.trim()] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}

// Middleware for socket authentication
export function authenticateSocket(io: Server) {
  io.use((socket: Socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token =
        cookies["__Secure-next-auth.session-token"] ||
        cookies["next-auth.session-token"];

      if (!token) {
        return next(new Error("No cookies found or not authenticated"));
      }

      const user = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET!
      ) as NextAuthJWT;
      socket.data.user = user;

      next();
    } catch (error) {
      console.error("WebSocket authentication failed:", error);
      next(new Error("Unauthorized"));
    }
  });
}
