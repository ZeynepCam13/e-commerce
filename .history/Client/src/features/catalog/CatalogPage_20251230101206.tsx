import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, FormGroup, FormControlLabel, Checkbox, Divider } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";
import ProductList from "../../features/catalog/ProductList";
import { useLocation } from "react-router";

export default function CatalogPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]); // Filtrelenmiş liste
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // Seçili markalar

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("category");
  // ... diğer paramlar

  // 1. Veriyi Çekme
  useEffect(() => {
    setLoading(true);
    // Mevcut API istek mantığın (categoryId, search vs. göre)
    requests.Catalog.list()
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); // Başlangıçta hepsi görünsün
      })
      .finally(() => setLoading(false));
  }, [categoryId]); // Parametreler değiştikçe tetiklenir

  // 2. Filtreleme Mantığı (Frontend tarafında basit filtreleme)
  useEffect(() => {
    if (selectedBrands.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => selectedBrands.includes(p.marka || ""));
      setFilteredProducts(filtered);
    }
  }, [selectedBrands, products]);

  const handleBrandChange = (brand: string) => {
    const currentIndex = selectedBrands.indexOf(brand);
    const newChecked = [...selectedBrands];

    if (currentIndex === -1) newChecked.push(brand);
    else newChecked.splice(currentIndex, 1);

    setSelectedBrands(newChecked);
  };

  // Benzersiz markaları ürün listesinden alalım (Dinamik marka listesi)
  const brands = Array.from(new Set(products.map(p => p.marka).filter(Boolean)));

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* SOL PANEL - FİLTRELER */}
        <Grid item xs={12} md={3} lg={2.5}>
          <Paper sx={{ p: 2, borderRadius: 0, border: "1px solid #eee", boxShadow: "none" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Filtrele</Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Markalar</Typography>
            <FormGroup>
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox 
                      size="small" 
                      onChange={() => handleBrandChange(brand!)}
                      checked={selectedBrands.includes(brand!)}
                    />
                  }
                  label={<Typography variant="body2">{brand}</Typography>}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        {/* SAĞ TARAF - ÜRÜN LİSTESİ */}
        <Grid item xs={12} md={9} lg={9.5}>
          {loading ? (
            <Typography>Yükleniyor...</Typography>
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}