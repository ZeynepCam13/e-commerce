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

  // URL'deki kategori id veya search parametresini yakala
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("category");
  const search = params.get("search");

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      requests.Catalog.getByCategory(Number(categoryId))
        .then((data) => setProducts(data))
        .finally(() => setLoading(false));
    } else if (search) {
      requests.Catalog.list()
        .then((data) => {
          const filtered = data.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
          setProducts(filtered);
        })
        .finally(() => setLoading(false));
    } else {
      requests.Catalog.list()
        .then((data) => setProducts(data))
        .finally(() => setLoading(false));
    }
  }, [categoryId, search]);

  return (
    <Box>
      {loading ? <div>Yükleniyor...</div> : <ProductList products={products} />}
    </Box>
  );
}
