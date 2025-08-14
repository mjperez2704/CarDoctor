"use client";
import { useSession } from "@/hooks/use-session";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

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
    // Si el usuario está logueado, se redirige al dashboard principal
    redirect("/dashboard");
  } else {
    // Si no, se redirige a la página de login
    redirect("/login");
  }

  // No se renderiza nada aquí, ya que siempre habrá una redirección.
  return null;
}
