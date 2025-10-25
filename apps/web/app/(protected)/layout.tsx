"use client";

import { useUserStore } from "@repo/store";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import MsgHandler from "../../components/MsgAndError";
import { setLocalStorage } from "../../utils/localStorage";
import Loading from "../../components/Loading";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useUserStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setLocalStorage();
      const user = session.user as {
        id: string;
        name: string;
        email: string;
        image?: string;
      };
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user?.image,
      });
    } else if (status === "unauthenticated") {
      redirect("/api/auth/signin");
    }
  }, [session, status, setUser]);

  if (status == "loading") return <Loading />;

  if (status !== "authenticated" || !session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <Toaster />
      <MsgHandler />
      {children}
    </>
  );
}
