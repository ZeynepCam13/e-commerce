import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Button
} from "@mui/material";
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
  const subsub = params.get("subsub"); // 🔴 KRİTİK EKLENDİ

  // 1. Veriyi API'den Çekme + URL Filtreleri
  useEffect(() => {
    setLoading(true);

    requests.Catalog.list()
      .then((data: IProduct[]) => {
        let baseData = data;

        // 🔍 Arama filtresi
        if (search) {
          baseData = baseData.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // 🧩 SUBSUB CATEGORY filtresi (URL'den)
        if (subsub) {
          baseData = baseData.filter(
            p => p.subSubCategory?.id === Number(subsub)
          );
        }

        setProducts(baseData);
        setFilteredProducts(baseData);
      })
      .finally(() => setLoading(false));

  }, [search, subsub]); // 🔴 subsub dependency EKLENDİ

  // 2. Checkbox filtreleri
  useEffect(() => {
    let result = [...products];

    // Marka
    if (selectedBrands.length > 0) {
      result = result.filter(p =>
        selectedBrands.includes(p.marka || "")
      );
    }

    // Cinsiyet / Kategori (isim bazlı)
    if (selectedGenders.length > 0) {
      const lowerGenders = selectedGenders.map(g => g.toLowerCase());

      result = result.filter(p => {
        const categoryMatch =
          p.category?.name &&
          lowerGenders.includes(p.category.name.toLowerCase());

        const subMatch =
          p.subCategory?.name &&
          lowerGenders.includes(p.subCategory.name.toLowerCase());

        const subSubMatch =
          p.subSubCategory?.name &&
          lowerGenders.includes(p.subSubCategory.name.toLowerCase());

        return categoryMatch || subMatch || subSubMatch;
      });
    }

    // Renk
    if (selectedColors.length > 0) {
      result = result.filter(p =>
        p.productColors?.some(pc =>
          selectedColors.includes(pc.colorName || "")
        )
      );
    }

    setFilteredProducts(result);

  }, [selectedBrands, selectedGenders, selectedColors, products]);

  const handleToggle = (
    value: string,
    currentList: string[],
    setList: (val: string[]) => void
  ) => {
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

  const brands = Array.from(
    new Set(products.map(p => p.marka).filter(Boolean))
  ).sort((a, b) => a!.localeCompare(b!, "tr"));

  const colorMap = [
    { name: "Siyah", code: "#000000" },
    { name: "Beyaz", code: "#FFFFFF" },
    { name: "Mavi", code: "#0000FF" },
    { name: "Kırmızı", code: "#FF0000" },
    { name: "Bej", code: "#F5F5DC" },
    { name: "Pembe", code: "#f82ed6be" }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* SOL PANEL */}
        <Grid item xs={12} md={3} lg={2.5}>
          <Paper sx={{ p: 2, borderRadius: 0, border: "1px solid #eee", boxShadow: "none" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Filtrele</Typography>
              <Button size="small" onClick={resetFilters}>Temizle</Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Cinsiyet</Typography>
            <FormGroup sx={{ mb: 2 }}>
              {["Kadın", "Erkek"].map(gender => (
                <FormControlLabel
                  key={gender}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedGenders.includes(gender)}
                      onChange={() =>
                        handleToggle(gender, selectedGenders, setSelectedGenders)
                      }
                    />
                  }
                  label={gender}
                />
              ))}
            </FormGroup>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Renk</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {colorMap.map(color => (
                <Box
                  key={color.name}
                  onClick={() =>
                    handleToggle(color.name, selectedColors, setSelectedColors)
                  }
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: color.code,
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: selectedColors.includes(color.name)
                      ? "2px solid black"
                      : "1px solid #ddd"
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Markalar</Typography>
            <FormGroup>
              {brands.map(brand => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedBrands.includes(brand!)}
                      onChange={() =>
                        handleToggle(brand!, selectedBrands, setSelectedBrands)
                      }
                    />
                  }
                  label={brand}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        {/* ÜRÜNLER */}
        <Grid item xs={12} md={9} lg={9.5}>
          {loading ? (
            <Typography sx={{ textAlign: "center", mt: 10 }}>
              Yükleniyor...
            </Typography>
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
