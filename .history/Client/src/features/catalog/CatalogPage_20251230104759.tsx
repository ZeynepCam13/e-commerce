import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, FormGroup, FormControlLabel, Checkbox, Divider, Button } from "@mui/material";
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
  const search = params.get("search");
  

  useEffect(() => {
    setLoading(true);
    requests.Catalog.list()
      .then((data: IProduct[]) => {
        let baseData = data;
        if (search) {
          baseData = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        setProducts(baseData);
        setFilteredProducts(baseData);
      })
      .finally(() => setLoading(false));
  }, [search]);

  // Filtreleme Mantığı
  useEffect(() => {
    let result = [...products];

    // Marka Filtresi
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.marka || ""));
    }

    // Cinsiyet Filtrelemesi
if (selectedGenders.length > 0) {
  result = result.filter(p => 
    p.category?.name && 
    selectedGenders.some(g => g.toLowerCase() === p.category?.name.toLowerCase())
  );
}
    // Renk Filtresi (Ürünün renk listesinde seçili renk var mı?)
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

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedGenders([]);
    setSelectedColors([]);
  };

  const brands = Array.from(new Set(products.map(p => p.marka).filter(Boolean))).sort((a,b)=>a!.localeCompare(b!,'tr'));
  
  // Renk kodlarını backend'den gelmiyorsa elle eşleştirebiliriz
  const colorMap = [
    { name: "Siyah", code: "#000000" },
    { name: "Beyaz", code: "#FFFFFF" },
    { name: "Mavi", code: "#0000FF" },
    { name: "Kırmızı", code: "#FF0000" },
    { name: "Bej", code: "#F5F5DC" }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} lg={2.5}>
          <Paper sx={{ p: 2, borderRadius: 0, border: "1px solid #eee", boxShadow: "none" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Filtrele</Typography>
                <Button size="small" onClick={resetFilters} sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Temizle</Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />

            {/* CİNSİYET (Kategori Bazlı) */}
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

            {/* RENKLER (IProductColorDto Bazlı) */}
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
            
            {/* MARKALAR */}
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Markalar</Typography>
            <FormGroup>
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={<Checkbox size="small" checked={selectedBrands.includes(brand!)} onChange={() => handleToggle(brand!, selectedBrands, setSelectedBrands)} />}
                  label={<Typography variant="body2">{brand}</Typography>}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9} lg={9.5}>
          {loading ? <Typography sx={{ textAlign: 'center', mt: 10 }}>Yükleniyor...</Typography> : <ProductList products={filteredProducts} />}
        </Grid>
      </Grid>
    </Box>
  );
}