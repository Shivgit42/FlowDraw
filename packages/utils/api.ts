import axios from "axios";
import { getSession } from "next-auth/react";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://flowdraw-http.onrender.com/api",
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const accessToken = (session as any)?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
