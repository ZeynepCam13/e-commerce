import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";
import ProductList from "../../features/catalog/ProductList";
import CategoryList from "../../features/category/CategoryList";

export default function CatalogPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function loadProducts(categoryId?: number) {
    setLoading(true);
    const request = categoryId
      ? requests.Catalog.getByCategory(categoryId)
      : requests.Catalog.list();
    request.then(data => setProducts(data)).finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts(); // başlangıçta tüm ürünleri getir
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <CategoryList onCategorySelect={loadProducts} />
      </Grid>
      <Grid item xs={12} md={9}>
        {loading ? <div>Loading...</div> : <ProductList products={products} />}
      </Grid>
    </Grid>
  );
}
