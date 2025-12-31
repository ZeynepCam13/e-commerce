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
  Button,
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

  const categoryId = params.get("category");
  const subCategoryId = params.get("subcategory");
  const subSubCategoryId = params.get("subsub");
  const search = params.get("search");

  /**
   * 1️⃣ URL'e göre BACKEND'den veri çekme
   * (Bu kısım ESKİ ÇALIŞAN KODUN BİREBİR MANTIĞI)
   */
  useEffect(() => {
    setLoading(true);

    const finish = (data: IProduct[]) => {
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    };

    if (subSubCategoryId) {
      requests.Catalog.bySubSub(Number(subSubCategoryId))
        .then(finish);
      return;
    }

    if (subCategoryId) {
      requests.Catalog.bySubCategory(Number(subCategoryId))
        .then(finish);
      return;
    }

    if (categoryId) {
      requests.Catalog.byCategory(Number(categoryId))
        .then(finish);
      return;
    }

    if (search) {
      requests.Catalog.list()
        .then((data:IProduct[]) => {
          const filtered = data.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
          finish(filtered);
        });
      return;
    }

    requests.Catalog.list()
      .then(finish);

  }, [categoryId, subCategoryId, subSubCategoryId, search]);

  /**
   * 2️⃣ FRONTEND checkbox filtreleri
   */
  useEffect(() => {
    let result = [...products];

    // Marka
    if (selectedBrands.length > 0) {
      result = result.filter(p =>
        selectedBrands.includes(p.marka || "")
      );
    }

    // Cinsiyet / kategori ismi
    if (selectedGenders.length > 0) {
      const lower = selectedGenders.map(g => g.toLowerCase());

      result = result.filter(p => {
        return (
          (p.category?.name && lower.includes(p.category.name.toLowerCase())) ||
          (p.subCategory?.name && lower.includes(p.subCategory.name.toLowerCase())) ||
          (p.subSubCategory?.name && lower.includes(p.subSubCategory.name.toLowerCase()))
        );
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
    const index = currentList.indexOf(value);
    const newList = [...currentList];
    index === -1 ? newList.push(value) : newList.splice(index, 1);
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
    { name: "Mavi", code: "#3eb1f8ff" },
    { name: "Kırmızı", code: "#FF0000" },
    { name: "Bej", code: "#F5F5DC" },
    { name: "Pembe", code: "#f82ed6be" },
    { name: "Yeşil", code: "#369d36ff" },
    { name: "Gri", code: "#838080ff" },
    { name: "Sarı", code: "#f3ea6cff" },
    { name: "Mor", code: "#491f45ff" },
    { name: "Lacivert", code: "#2e139bff" },
    { name: "Bordo", code: "#6a0b0bff" },
    { name: "Turuncu", code: "#da7421ff" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* SOL PANEL */}
        <Grid item xs={12} md={3} lg={2.5}>
          <Paper sx={{ p: 2, border: "1px solid #eee", boxShadow: "none" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">Filtrele</Typography>
              <Button size="small" onClick={resetFilters}>Temizle</Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2">Cinsiyet</Typography>
            <FormGroup sx={{ mb: 2 }}>
              {["Kadın", "Erkek"].map(g => (
                <FormControlLabel
                  key={g}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedGenders.includes(g)}
                      onChange={() =>
                        handleToggle(g, selectedGenders, setSelectedGenders)
                      }
                    />
                  }
                  label={g}
                />
              ))}
            </FormGroup>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2">Renk</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {colorMap.map(c => (
                <Box
                  key={c.name}
                  onClick={() =>
                    handleToggle(c.name, selectedColors, setSelectedColors)
                  }
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: c.code,
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: selectedColors.includes(c.name)
                      ? "2px solid black"
                      : "1px solid #ddd",
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2">Markalar</Typography>
            <FormGroup>
              {brands.map(b => (
                <FormControlLabel
                  key={b}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedBrands.includes(b!)}
                      onChange={() =>
                        handleToggle(b!, selectedBrands, setSelectedBrands)
                      }
                    />
                  }
                  label={b}
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
