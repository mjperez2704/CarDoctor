"use client";
import { useSession } from "@/hooks/use-session";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function Home() {
  const { user } = useSession();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}