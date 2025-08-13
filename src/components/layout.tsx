import Link from "next/link";
import {
  Briefcase,
  Calculator,
  LayoutDashboard,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
  Users,
  Wrench,
  Warehouse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserAvatar } from "./user-avatar";

export function AppLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 -ml-14 -mt-4">
        {/* El contenido del header se mueve a ProtectedLayout */}
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
      <div className="-ml-14">
        {children}
      </div>
    </>
  );
}
