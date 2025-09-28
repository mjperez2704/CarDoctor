// src/components/dashboard.tsx

"use client";

import * as React from "react";
import {
    Activity,
    ArrowUpRight,
    DollarSign,
    Package,
    Wrench,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

import Link from "next/link";

// Tipos actualizados para las props que vienen del servidor
type CardStats = {
    activeWorkOrders: number;
    lowStockItems: number;
    monthlyRevenue: number;
    revenueChange: number;
    recentActivity: number;
    activityChange: number;
};

type ChartData = {
    status?: string;
    name?: string;
    total?: number;
    value?: number;
    fill?: string;
};

type DashboardProps = {
    cardStats: CardStats;
    workOrdersByStatus: ChartData[];
    inventoryByCategory: ChartData[];
};

export function Dashboard({
                              cardStats,
                              workOrdersByStatus,
                              inventoryByCategory
                          }: DashboardProps) {

    const chartConfig = {
        total: {
            label: "Total",
        },
    };

    const inventoryChartConfig = {
        items: {
            label: "Refacciones",
        },
        ...inventoryByCategory.reduce((acc, item) => {
            if(item.name && item.fill) {
                acc[item.name] = { label: item.name, color: item.fill };
            }
            return acc;
        }, {} as any)
    };
    
    // Función para formatear moneda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(value);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {/* Órdenes Activas */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Órdenes Activas</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{cardStats.activeWorkOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Vehículos actualmente en el taller
                        </p>
                    </CardContent>
                </Card>
                {/* Refacciones en Bajo Stock */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Refacciones en Bajo Stock</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{cardStats.lowStockItems}</div>
                        <p className="text-xs text-muted-foreground">
                            Artículos que necesitan reabastecimiento
                        </p>
                    </CardContent>
                </Card>
                {/* Ingresos del Mes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(cardStats.monthlyRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            {cardStats.revenueChange >= 0 ? '+' : ''}{cardStats.revenueChange.toFixed(1)}% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
                {/* Actividad Reciente */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Actividad Reciente</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{cardStats.recentActivity}</div>
                        <p className="text-xs text-muted-foreground">
                           {cardStats.activityChange >= 0 ? '+' : ''}{cardStats.activityChange} desde la última semana
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Órdenes de Servicio por Estado</CardTitle>
                            <CardDescription>
                                Distribución de las órdenes de servicio activas e históricas.
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/work-orders">
                                Ver Todas
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[300px]">
                            <BarChart accessibilityLayer data={workOrdersByStatus}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="status"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Bar dataKey="total" fill="var(--color-total)" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Inventario por Categoría</CardTitle>
                        <CardDescription>
                            Distribución de las refacciones por categoría principal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-0">
                        <ChartContainer
                            config={inventoryChartConfig}
                            className="mx-auto aspect-square max-h-[300px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie data={inventoryByCategory} dataKey="value" nameKey="name" />
                                <ChartLegend
                                    content={<ChartLegendContent nameKey="name" />}
                                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
