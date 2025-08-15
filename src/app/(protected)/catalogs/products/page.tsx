import { ProductCatalog } from "@/components/product-catalog";
import { getProductos } from "@/lib/data";

export default async function ProductsCatalogPage() {
  const products = getProductos();
  
  return (
    <ProductCatalog initialProducts={products} />
  );
}
