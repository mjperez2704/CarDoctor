import {
  Briefcase,
  Car,
  CircleUserRound,
  ClipboardList,
  Contact,
  FileText,
  Fingerprint,
  Landmark,
  LayoutDashboard,
  LineChart,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Users,
  Warehouse,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { NavLink } from '@/components/nav-link';
import { cn } from '@/lib/utils';


const NavMenu = ({className} : {className?: string}) => (
  <Accordion
    type="multiple"
    className={cn("w-full", className)}
    defaultValue={['operaciones', 'catalogos', 'contactos', 'administracion', 'inventario']}
  >
    {/* Operaciones */}
    <AccordionItem value="operaciones">
      <AccordionTrigger>
        <div className="flex items-center gap-3">
          <Wrench className="h-5 w-5" />
          <span>Operaciones</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        <nav className="grid items-start gap-1">
          <NavLink href="/reception">
            <Car className="h-4 w-4" /> Recepción de Vehículos
          </NavLink>
          <NavLink href="/work-orders">
            <FileText className="h-4 w-4" /> Órdenes de Servicio
          </NavLink>
          <NavLink href="/quotes">
            <Briefcase className="h-4 w-4" /> Cotizaciones
          </NavLink>
          <NavLink href="/purchases">
            <ShoppingCart className="h-4 w-4" /> Compras
          </NavLink>
        </nav>
      </AccordionContent>
    </AccordionItem>

    {/* Catálogos */}
    <AccordionItem value="catalogos">
      <AccordionTrigger>
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5" />
          <span>Catálogos</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        <nav className="grid items-start gap-1">
          <NavLink href="/catalogs/products">
            <Package className="h-4 w-4" /> Refacciones
          </NavLink>
          <NavLink href="/catalogs/vehicles">
            <Car className="h-4 w-4" /> Vehículos
          </NavLink>
          <NavLink href="/catalogs/tools">
            <Wrench className="h-4 w-4" /> Herramientas
          </NavLink>
        </nav>
      </AccordionContent>
    </AccordionItem>

    {/* Contactos */}
    <AccordionItem value="contactos">
      <AccordionTrigger>
        <div className="flex items-center gap-3">
          <Contact className="h-5 w-5" />
          <span>Contactos</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        <nav className="grid items-start gap-1">
          <NavLink href="/drivers">
            <Users className="h-4 w-4" /> Choferes
          </NavLink>
          <NavLink href="/providers">
            <Truck className="h-4 w-4" /> Proveedores
          </NavLink>
        </nav>
      </AccordionContent>
    </AccordionItem>
    
    {/* Inventario */}
    <AccordionItem value="inventario">
      <AccordionTrigger>
        <div className="flex items-center gap-3">
          <Warehouse className="h-5 w-5" />
          <span>Inventario</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        <nav className="grid items-start gap-1">
           <NavLink href="/inventory">
            <Package className="h-4 w-4" /> Inventario General
          </NavLink>
          <NavLink href="/warehouse">
            <Warehouse className="h-4 w-4" /> Gestión de Almacén
          </NavLink>
          <NavLink href="/transfers">
            <Truck className="h-4 w-4" /> Traslados
          </NavLink>
        </nav>
      </AccordionContent>
    </AccordionItem>

    {/* Administración */}
    <AccordionItem value="administracion">
      <AccordionTrigger>
        <div className="flex items-center gap-3">
          <Landmark className="h-5 w-5" />
          <span>Administración</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        <nav className="grid items-start gap-1">
          <NavLink href="/employees">
            <CircleUserRound className="h-4 w-4" /> Empleados
          </NavLink>
           <NavLink href="/finances/expenses">
            <FileText className="h-4 w-4" /> Gastos
          </NavLink>
          <NavLink href="/users">
            <User className="h-4 w-4" /> Usuarios
          </NavLink>
          <NavLink href="/vendedores">
            <Users className="h-4 w-4" /> Vendedores
          </NavLink>
        </nav>
      </AccordionContent>
    </AccordionItem>
    
     {/* Reportes */}
    <AccordionItem value="reportes">
      <AccordionTrigger>
        <div className="flex items-center gap-3">
          <LineChart className="h-5 w-5" />
          <span>Reportes</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4">
         <nav className="grid items-start gap-1">
          <NavLink href="/reports/predetermined">
            <FileText className="h-4 w-4" /> Reportes Predeterminados
          </NavLink>
        </nav>
      </AccordionContent>
    </AccordionItem>

    {/* Configuración */}
    <AccordionItem value="configuracion">
      <AccordionTrigger>
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5" />
          <span>Configuración</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        <nav className="grid items-start gap-1">
          <NavLink href="/roles">
            <Fingerprint className="h-4 w-4" /> Roles y Permisos
          </NavLink>
           <NavLink href="/settings/rules">
            <Wrench className="h-4 w-4" /> Reglas de Negocio
          </NavLink>
        </nav>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r sm:flex bg-[#2D1E1E] text-white">
        <div className="flex h-16 items-center gap-2 border-b border-gray-700 px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Wrench className="h-6 w-6 text-red-400" />
            <span className="text-lg">Mi Taller Mecánico</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink href="/dashboard" className="text-gray-300 hover:text-white [&.active]:bg-red-800/30 [&.active]:text-white">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </NavLink>
            <NavMenu className="text-gray-300 [&_span]:hover:text-white [&_svg]:hover:text-white [&_a.active]:bg-red-800/30 [&_a.active]:text-white [&_a]:hover:text-white"/>
          </nav>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs bg-[#2D1E1E] text-white border-r-0">
              <div className="flex h-16 items-center gap-2 border-b border-gray-700 px-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <Wrench className="h-6 w-6 text-red-400" />
                  <span className="">Mi Taller Mecánico</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                 <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <NavLink href="/dashboard" className="text-gray-300 hover:text-white [&.active]:bg-red-800/30 [&.active]:text-white">
                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                  </NavLink>
                  <NavMenu className="text-gray-300 [&_span]:hover:text-white [&_svg]:hover:text-white [&_a.active]:bg-red-800/30 [&_a.active]:text-white [&_a]:hover:text-white"/>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Title can go here if needed */}
          </div>
          <UserAvatar />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
