import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import requests from "../api/requests";
import { IProduct } from "../model/IProduct";
import ProductList from "./catalog/ProductList";


export default function DiscountPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requests.Catalog.discounted()
      .then((data) =>{ if (Array.isArray(data)) setProducts(data);
      else setProducts([]); 
    })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        İndirimdeki Ürünler
      </Typography>

      {products.length === 0 ? (
        <Typography textAlign="center" mt={4}>
          Şu an indirimde ürün yok
        </Typography>
      ) : (
        <ProductList products={products} />
      )}
    </Box>
  );
}
