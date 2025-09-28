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
    Monitor, // <--- Icono agregado
} from 'lucide-react';
import Link from 'next/link';
// CORRECCIÓN: Se importan SheetHeader y SheetTitle
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { NavLink } from '@/components/nav-link';
import { cn } from '@/lib/utils';
import NextImage from "next/image";


const NavMenu = ({className} : {className?: string}) => (
    <Accordion
        type="multiple"
        className={cn("w-full", className)}
        defaultValue={['operaciones', 'catalogos', 'contactos', 'administracion', 'inventario']}
    >
        {/* Operaciones */}
        <AccordionItem value="operaciones" className="border-b-blue-500">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5" />
                    <span>Operaciones</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
                <nav className="grid items-start gap-1">
                    {/* ===== INICIO DE LA MODIFICACIÓN ===== */}
                    <NavLink href="/pos" variant="dark">
                        <Monitor className="h-4 w-4" /> Ventas (POS)
                    </NavLink>
                    {/* ===== FIN DE LA MODIFICACIÓN ===== */}
                    <NavLink href="/reception" variant="dark">
                        <Car className="h-4 w-4" /> Recepción de Vehículos
                    </NavLink>
                    <NavLink href="/work-orders" variant="dark">
                        <FileText className="h-4 w-4" /> Órdenes de Servicio
                    </NavLink>
                    <NavLink href="/catalogs/vehicles" variant="dark">
                        <Car className="h-4 w-4" /> Vehículos en Taller
                    </NavLink>
                    <NavLink href="/quotes" variant="dark">
                        <Briefcase className="h-4 w-4" /> Cotizaciones
                    </NavLink>
                    <NavLink href="/purchases" variant="dark">
                        <ShoppingCart className="h-4 w-4" /> Compras
                    </NavLink>
                </nav>
            </AccordionContent>
        </AccordionItem>

        {/* Catálogos */}
        <AccordionItem value="catalogos" className="border-b-blue-500">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5" />
                    <span>Catálogos</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
                <nav className="grid items-start gap-1">
                    <NavLink href="/catalogs/products" variant="dark">
                        <Package className="h-4 w-4" /> Refacciones
                    </NavLink>
                    <NavLink href="/catalogs/tools" variant="dark">
                        <Wrench className="h-4 w-4" /> Herramientas
                    </NavLink>
                </nav>
            </AccordionContent>
        </AccordionItem>

        {/* Contactos */}
        <AccordionItem value="contactos" className="border-b-blue-500">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <Contact className="h-5 w-5" />
                    <span>Contactos</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
                <nav className="grid items-start gap-1">
                    <NavLink href="/customers" variant="dark">
                        <Users className="h-4 w-4" /> Clientes
                    </NavLink>
                    <NavLink href="/providers" variant="dark">
                        <Truck className="h-4 w-4" /> Proveedores
                    </NavLink>
                </nav>
            </AccordionContent>
        </AccordionItem>

        {/* Inventario */}
        <AccordionItem value="inventario" className="border-b-blue-500">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <Warehouse className="h-5 w-5" />
                    <span>Inventario</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
                <NavLink href="/inventory" variant="dark">
                    <Package className="h-4 w-4" /> Inventario General
                </NavLink>
                <NavLink href="/warehouse" variant="dark">
                    <Warehouse className="h-4 w-4" /> Gestión de Almacén
                </NavLink>
                <NavLink href="/transfers" variant="dark">
                    <Truck className="h-4 w-4" /> Traslados
                </NavLink>
            </AccordionContent>
        </AccordionItem>

        {/* Administración */}
        <AccordionItem value="administracion" className="border-b-blue-500">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <Landmark className="h-5 w-5" />
                    <span>Administración</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
                <nav className="grid items-start gap-1">
                    <NavLink href="/employees" variant="dark">
                        <CircleUserRound className="h-4 w-4" /> Empleados
                    </NavLink>
                    <NavLink href="/finances/expenses" variant="dark">
                        <FileText className="h-4 w-4" /> Gastos
                    </NavLink>
                    <NavLink href="/users" variant="dark">
                        <User className="h-4 w-4" /> Usuarios
                    </NavLink>
                    <NavLink href="/vendedores" variant="dark">
                        <Users className="h-4 w-4" /> Vendedores
                    </NavLink>
                </nav>
            </AccordionContent>
        </AccordionItem>

        {/* Reportes */}
        <AccordionItem value="reportes" className="border-b-blue-500">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <LineChart className="h-5 w-5" />
                    <span>Reportes</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
                <nav className="grid items-start gap-1">
                    <NavLink href="/reports/predetermined" variant="dark">
                        <FileText className="h-4 w-4" /> Reportes Predeterminados
                    </NavLink>
                </nav>
            </AccordionContent>
        </AccordionItem>

        {/* Configuración */}
        <AccordionItem value="configuracion" className="border-b-0">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span>Configuración</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
                <nav className="grid items-start gap-1">
                    <NavLink href="/roles" variant="dark">
                        <Fingerprint className="h-4 w-4" /> Roles y Permisos
                    </NavLink>
                    <NavLink href="/settings/rules" variant="dark">
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
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r sm:flex bg-black text-white">
                <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-4 lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        {/*<Wrench className="h-6 w-6" />*/}
                        <span className="text-lg">
                            <NextImage src="/assets/nombre_negro.png" alt="Car Doctor" width={300} height={160} className="h-12 w-auto"/>
                            </span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <NavLink href="/dashboard" variant="dark">
                            <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </NavLink>
                        <NavMenu />
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
                        <SheetContent side="left" className="sm:max-w-xs bg-black text-white">
                            {/* CORRECCIÓN: Se añade el SheetHeader y SheetTitle para accesibilidad */}
                            <SheetHeader className="sr-only">
                                <SheetTitle>Menú Principal</SheetTitle>
                            </SheetHeader>
                            <div className="flex h-16 items-center gap-2 border-b px-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 font-semibold">
                                    {/*<Wrench className="h-6 w-6 text-primary" />
                                    <span className="">Mi Taller Mecánico</span>*/}
                                    
                                </Link>
                            </div>
                            <div className="flex-1 overflow-auto py-2">
                                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                    <NavLink href="/dashboard">
                                        <LayoutDashboard className="h-5 w-5" /> Dashboard
                                    </NavLink>
                                    <NavMenu/>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="relative ml-auto flex-1 md:grow-0">
                    </div>
                </header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
