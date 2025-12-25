import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";
import ProductList from "../../features/catalog/ProductList";
import { useLocation } from "react-router";

export default function CatalogPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const categoryId = params.get("category");
  const subCategoryId = params.get("subcategory");
  const subSubCategoryId = params.get("subsub");
  const search = params.get("search");

  useEffect(() => {
    setLoading(true);

    // 1) ALT–ALT kategori filtresi
    if (subSubCategoryId) {
      requests.Catalog.bySubSub(Number(subSubCategoryId))
        .then((data) => setProducts(data))
        .finally(() => setLoading(false));
      return;
    }

    // 2) ALT kategori filtresi
    if (subCategoryId) {
      requests.Catalog.bySubCategory(Number(subCategoryId))
        .then((data) => setProducts(data))
        .finally(() => setLoading(false));
      return;
    }

    // 3) ANA kategori filtresi
    if (categoryId) {
      requests.Catalog.byCategory(Number(categoryId))
        .then((data) => setProducts(data))
        .finally(() => setLoading(false));
      return;
    }

    // 4) Arama filtresi
    if (search) {
      requests.Catalog.list()
        .then((data: IProduct[]) => {
          const filtered = data.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
          setProducts(filtered);
        })
        .finally(() => setLoading(false));
      return;
    }

    // 5) Hiç parametre yoksa tüm ürünler
    requests.Catalog.list()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [categoryId, subCategoryId, subSubCategoryId, search]);

  return (
    <Box>
      {loading ? <div>Yükleniyor...</div> : <ProductList products={products} />}
    </Box>
  );
}
