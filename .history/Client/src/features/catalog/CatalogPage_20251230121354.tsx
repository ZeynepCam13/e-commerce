import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, FormGroup, FormControlLabel, Checkbox, Divider, Button, CircularProgress } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";
import ProductList from "../../features/catalog/ProductList";
import { useLocation } from "react-router";

export default function CatalogPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filtre State'leri (Hata almamak için string[] yapıldı)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("category");
  const subCategoryId = params.get("subcategory");
  const subSubCategoryId = params.get("subsub");
  const search = params.get("search");

  // 1. Veriyi API'den Çekme (Eski Kategorili Mantığın)
  useEffect(() => {
    setLoading(true);
    const getProducts = () => {
      if (subSubCategoryId) return requests.Catalog.bySubSub(Number(subSubCategoryId));
      if (subCategoryId) return requests.Catalog.bySubCategory(Number(subCategoryId));
      if (categoryId) return requests.Catalog.byCategory(Number(categoryId));
      return requests.Catalog.list();
    };

    getProducts()
      .then((data: IProduct[]) => {
        let baseData = data;
        if (search) {
          baseData = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        setProducts(baseData);
        setFilteredProducts(baseData);
      })
      .catch(err => console.error("Veri çekme hatası:", err))
      .finally(() => setLoading(false));
  }, [categoryId, subCategoryId, subSubCategoryId, search]);

  // 2. Yan Menü Filtreleme
  useEffect(() => {
    let result = [...products];

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.marka || ""));
    }

    if (selectedGenders.length > 0) {
      result = result.filter(p => {
        const lowerGenders = selectedGenders.map(g => g.toLowerCase());
        const catMatch = p.category?.name && lowerGenders.includes(p.category.name.toLowerCase());
        const subMatch = p.subCategory?.name && lowerGenders.includes(p.subCategory.name.toLowerCase());
        const subSubMatch = p.subSubCategory?.name && lowerGenders.includes(p.subSubCategory.name.toLowerCase());
        return catMatch || subMatch || subSubMatch;
      });
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => 
        p.productColors?.some(pc => selectedColors.includes(pc.colorName || ""))
      );
    }
    setFilteredProducts(result);
  }, [selectedBrands, selectedGenders, selectedColors, products]);

  const handleToggle = (value: string, currentList: string[], setList: (val: string[]) => void) => {
    const currentIndex = currentList.indexOf(value);
    const newList = [...currentList];
    if (currentIndex === -1) newList.push(value);
    else newList.splice(currentIndex, 1);
    setList(newList);
  };

  const brands = Array.from(new Set(products.map(p => p.marka).filter(Boolean)))
    .sort((a, b) => a!.localeCompare(b!, 'tr'));
  
  const colorMap = [
    { name: "Siyah", code: "#000000" }, { name: "Beyaz", code: "#FFFFFF" },
    { name: "Mavi", code: "#3eb1f8ff" }, { name: "Kırmızı", code: "#FF0000" },
    { name: "Bej", code: "#F5F5DC" }, { name: "Pembe" ,code:"#f82ed6be" },
    { name: "Yeşil", code: "#369d36ff" }, { name: "Gri", code: "#838080ff" },
    { name: "Sarı", code: "#f3ea6cff" }, { name: "Mor", code: "#491f45ff" },
    { name: "Lacivert", code: "#2e139bff" }, { name: "Bordo", code: "#6a0b0bff" },
    { name: "Turuncu", code: "#da7421ff" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} lg={2.5}>
          <Paper sx={{ p: 2, borderRadius: 0, border: "1px solid #eee", boxShadow: "none" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Filtrele</Typography>
              <Button size="small" onClick={() => { setSelectedBrands([]); setSelectedGenders([]); setSelectedColors([]); }} sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Temizle</Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Cinsiyet</Typography>
            <FormGroup sx={{ mb: 2 }}>
              {["Kadın", "Erkek"].map((gender) => (
                <FormControlLabel
                  key={gender}
                  control={<Checkbox size="small" checked={selectedGenders.includes(gender)} onChange={() => handleToggle(gender, selectedGenders, setSelectedGenders)} />}
                  label={<Typography variant="body2">{gender}</Typography>}
                />
              ))}
            </FormGroup>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Renk</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {colorMap.map((color) => (
                <Box
                  key={color.name}
                  onClick={() => handleToggle(color.name, selectedColors, setSelectedColors)}
                  sx={{
                    width: 28, height: 28, bgcolor: color.code, borderRadius: '50%',
                    border: selectedColors.includes(color.name) ? '2px solid black' : '1px solid #ddd',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Markalar</Typography>
            <FormGroup>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <FormControlLabel
                    key={brand}
                    control={<Checkbox size="small" checked={selectedBrands.includes(brand!)} onChange={() => handleToggle(brand!, selectedBrands, setSelectedBrands)} />}
                    label={<Typography variant="body2">{brand}</Typography>}
                  />
                ))
              ) : (
                <Typography variant="caption" color="text.secondary">Markalar yükleniyor...</Typography>
              )}
            </FormGroup>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9} lg={9.5}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress color="inherit" />
              <Typography sx={{ ml: 2 }}>Yükleniyor...</Typography>
            </Box>
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}