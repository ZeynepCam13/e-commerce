import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, FormGroup, FormControlLabel, Checkbox, Divider } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";
import ProductList from "../../features/catalog/ProductList";
import { useLocation } from "react-router";

export default function CatalogPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filtre State'leri
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("category");
  const search = params.get("search");

  // 1. Veriyi API'den Çekme
  useEffect(() => {
    setLoading(true);
    // Kategori veya arama parametrelerine göre veriyi getir
    requests.Catalog.list()
      .then((data: IProduct[]) => {
        let baseData = data;
        if (search) {
          baseData = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        // Eğer categoryId varsa burada ek filtreleme yapabilirsin
        setProducts(baseData);
        setFilteredProducts(baseData);
      })
      .finally(() => setLoading(false));
  }, [categoryId, search]);

  // 2. Filtreleme Mantığı (Seçimler değiştikçe çalışır)
  useEffect(() => {
    let result = [...products];

    // Marka Filtrelemesi
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.marka || ""));
    }

    // Cinsiyet Filtrelemesi
    if (selectedGenders.length > 0) {
      result = result.filter(p => selectedGenders.includes(p.gender || ""));
    }

    // Renk Filtrelemesi
    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.includes(p.color || ""));
    }

    setFilteredProducts(result);
  }, [selectedBrands, selectedGenders, selectedColors, products]);

  // Yardımcı Fonksiyon: Seçimleri yönetmek için
  const handleToggle = (value: string, currentList: string[], setList: (val: string[]) => void) => {
    const currentIndex = currentList.indexOf(value);
    const newList = [...currentList];
    if (currentIndex === -1) newList.push(value);
    else newList.splice(currentIndex, 1);
    setList(newList);
  };

  // Dinamik Veriler (Ürünlerden otomatik çekilir)
  const brands = Array.from(new Set(products.map(p => p.marka).filter(Boolean)));
  const colors = [
    { name: "Siyah", code: "#000000" },
    { name: "Beyaz", code: "#FFFFFF" },
    { name: "Bej", code: "#F5F5DC" },
    { name: "Mavi", code: "#0000FF" },
    { name: "Kahverengi", code: "#A52A2A" }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* SOL PANEL - FİLTRELER */}
        <Grid item xs={12} md={3} lg={2.5}>
          <Paper sx={{ p: 2, borderRadius: 0, border: "1px solid #eee", boxShadow: "none" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Filtrele</Typography>
            
            <Divider sx={{ mb: 2 }} />

            {/* CİNSİYET */}
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Cinsiyet</Typography>
            <FormGroup sx={{ mb: 2 }}>
              {["Kadın", "Erkek", "Unisex"].map((gender) => (
                <FormControlLabel
                  key={gender}
                  control={
                    <Checkbox 
                      size="small" 
                      checked={selectedGenders.includes(gender)}
                      onChange={() => handleToggle(gender, selectedGenders, setSelectedGenders)} 
                    />
                  }
                  label={<Typography variant="body2">{gender}</Typography>}
                />
              ))}
            </FormGroup>

            <Divider sx={{ mb: 2 }} />

            {/* RENKLER */}
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Renk</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {colors.map((color) => (
                <Box
                  key={color.name}
                  onClick={() => handleToggle(color.name, selectedColors, setSelectedColors)}
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: color.code,
                    borderRadius: '50%',
                    border: selectedColors.includes(color.name) ? '2px solid black' : '1px solid #ddd',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: '0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                  title={color.name}
                >
                   {selectedColors.includes(color.name) && (
                     <Box sx={{ width: 8, height: 8, bgcolor: color.name === 'Beyaz' ? 'black' : 'white', borderRadius: '50%' }} />
                   )}
                </Box>
              ))}
            </Box>

            <Divider sx={{ mb: 2 }} />
            
            {/* MARKALAR */}
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Markalar</Typography>
            <FormGroup>
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox 
                      size="small" 
                      onChange={() => handleToggle(brand!, selectedBrands, setSelectedBrands)}
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
            <Typography sx={{ textAlign: 'center', mt: 10 }}>Yükleniyor...</Typography>
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}