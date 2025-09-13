// apps/web/lib/server/auth.ts
import { getServerSession as nextAuthGetServerSession } from "next-auth";
import { authOption } from "../../app/api/auth/[...nextauth]/option"; // server-only

/**
 * Server-only helper to get NextAuth session
 * Can only be used in server components or API routes
 */
export const getServerSession = () => nextAuthGetServerSession(authOption);
