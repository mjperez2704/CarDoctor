import { BrandsManager } from "@/components/brands-manager";
import { getMarcas, getModelos } from "@/lib/data";

export default function BrandsCatalogPage() {
  const brands = getMarcas();
  const models = getModelos();

  return (
    <BrandsManager initialBrands={brands} initialModels={models} />
  );
}
