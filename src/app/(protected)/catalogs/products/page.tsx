import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductsCatalogPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos</CardTitle>
          <CardDescription>
            Administra los productos, refacciones y servicios que ofreces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: Módulo de catálogo de productos.</p>
        </CardContent>
      </Card>
  );
}
