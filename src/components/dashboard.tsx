
"use client";

import * as React from "react";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import type { Producto, OrdenServicio } from "@/lib/types";
import { getOrdenesServicio } from "@/lib/data";
import Link from "next/link";

type DashboardProps = {
  initialInventory: Producto[];
  // This prop is no longer used but kept for compatibility if needed elsewhere.
  initialAuditLogs: any[];
};

export function Dashboard({ initialInventory }: DashboardProps) {
  const [inventory, setInventory] = React.useState(initialInventory);
  const workOrders = getOrdenesServicio(); // Using mock data directly for now

  const lowStockItems = inventory.filter(
    (item) => item.stock_minimo && item.stock_minimo > 0 // Placeholder logic for stock
  ).length;

  const activeWorkOrders = workOrders.filter(
    (order) => order.estado !== "ENTREGADO" && order.estado !== "CANCELADO"
  ).length;

  // Data for charts
  const workOrdersByStatusData = workOrders.reduce((acc, order) => {
    const status = order.estado.replace("_", " ");
    const existing = acc.find((item) => item.status === status);
    if (existing) {
      existing.total++;
    } else {
      acc.push({ status, total: 1 });
    }
    return acc;
  }, [] as { status: string; total: number }[]);

  const inventoryByCategoryData = inventory.reduce((acc, item) => {
    const categoryName = `Categoría ${item.categoria_id}`; // Placeholder name
    const existing = acc.find((cat) => cat.name === categoryName);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: categoryName, value: 1, fill: `var(--chart-${acc.length + 1})` });
    }
    return acc;
  }, [] as { name: string; value: number, fill: string }[]);
  
  const chartConfig = {
    total: {
      label: "Total",
    },
  };
  const inventoryChartConfig = {
    items: {
      label: "Refacciones",
    },
    ...inventoryByCategoryData.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill };
      return acc;
    }, {} as any)
  };


  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Órdenes Activas
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkOrders}</div>
            <p className="text-xs text-muted-foreground">
              Vehículos actualmente en el taller
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Refacciones en Bajo Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Artículos que necesitan reabastecimiento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes (Demo)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actividad Reciente
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 desde la última semana
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
              <BarChart accessibilityLayer data={workOrdersByStatusData}>
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
                <Pie data={inventoryByCategoryData} dataKey="value" nameKey="name" />
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
