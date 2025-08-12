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
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Package className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">TrackFlow</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/warehouse"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Warehouse className="h-5 w-5" />
                Almacén
              </Link>
              <Link
                href="/employees"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Users className="h-5 w-5" />
                Empleados
              </Link>
              <Link
                href="/quotes"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Calculator className="h-5 w-5" />
                Cotizaciones
              </Link>
              <Link
                href="/repairs"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Wrench className="h-5 w-5" />
                Reparaciones
              </Link>
              <Link
                href="/purchases"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
                Compras
              </Link>
              <Link
                href="/sales"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Briefcase className="h-5 w-5" />
                Ventas
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                Configuración
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="relative ml-auto flex-1 md:grow-0">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <UserAvatar />
      </header>
      <div className="-ml-14">
        {children}
      </div>
    </>
  );
}