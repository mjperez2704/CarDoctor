// src/app/page.tsx
"use client";
import { redirect } from "next/navigation";

export default function Home() {
    // Redirige siempre a la página de login como punto de entrada
    redirect("/login");

}
