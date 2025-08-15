import { ProductCatalog } from "@/components/product-catalog";
import { getProductos, getProveedores, getMarcas } from "@/lib/data";

export default async function ProductsCatalogPage() {
  const products = getProductos();
  const providers = getProveedores();
  const brands = getMarcas();
  
  return (
    <ProductCatalog 
      initialProducts={products} 
      providers={providers}
      brands={brands}
    />
  );
}
