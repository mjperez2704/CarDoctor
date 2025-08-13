"use client";
import { useSession } from "@/hooks/use-session";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import HomePage from "./(protected)/page";

export default function Home() {
  const { user, loading } = useSession();
  
  if(loading) {
    return (
       <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    // Si el usuario está logueado, se renderiza la página principal protegida
    return <HomePage />;
  } else {
    redirect("/login");
  }

  return null;
}
