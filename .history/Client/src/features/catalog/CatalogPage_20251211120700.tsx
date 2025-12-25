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
  const search = params.get("search");

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      requests.Catalog.byCategory(Number(categoryId))
        .then((data: IProduct[]) => setProducts(data))
        .finally(() => setLoading(false));
      return;
    }

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

    // Default: tüm ürünler
    requests.Catalog.list()
      .then((data: IProduct[]) => setProducts(data))
      .finally(() => setLoading(false));
  }, [categoryId, search]);

  return (
    <Box>
      {loading ? <div>Yükleniyor...</div> : <ProductList products={products} />}
    </Box>
  );
}

