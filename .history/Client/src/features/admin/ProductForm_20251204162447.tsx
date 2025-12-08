import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";
import requests from "../../api/requests";
import { toast } from "react-toastify";
import axios from "axios";

interface Props {
  cancelEdit: () => void;
}

type Category = { id: number; name: string };

export default function ProductForm({ cancelEdit }: Props) {
  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
  });

  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // 🔥 RENK
  const colorOptions = ["Siyah", "Beyaz", "Kahverengi", "Gri", "Kırmızı"];
  const [selectedColor, setSelectedColor] = useState<string>("");

  // 🔥 BEDENLER
  const sizeOptions = ["S", "M", "L", "XL"];
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await requests.Catalog.getCategories();
        setCategories(res);
      } catch {
        toast.error("Kategoriler yüklenemedi!");
      }
    };
    loadCategories();
  }, []);

  // 🔥 BACKEND'E ÜRÜN + RESİMLER + BEDEN + RENK GÖNDERME
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      !formData.categoryId ||
      selectedSizes.length === 0 ||
      !selectedColor
    ) {
      toast.error("Lütfen tüm alanları doldurun (renk ve beden dahil).");
      return;
    }

    const form = new FormData();

    form.append("Name", formData.name);
    form.append("Price", formData.price);
    form.append("Stock", formData.stock);
    form.append("Description", formData.description);
    form.append("CategoryId", formData.categoryId);

    // 🔥 En önemli bölüm
    form.append("Color", selectedColor);
    form.append("Sizes", selectedSizes.join(",")); // "S,M,XL"

    if (galleryFiles) {
      for (let i = 0; i < galleryFiles.length; i++) {
        form.append("Images", galleryFiles[i]);
      }
    }

    try {
      await axios.post("/products", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Ürün başarıyla eklendi!");
      cancelEdit();
    } catch (err) {
      toast.error("Ürün eklenirken hata oluştu!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#f9f9f9",
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 520 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Yeni Ürün Ekle
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Ad"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Fiyat"
            type="number"
            margin="normal"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          {/* 🔥 RENK SEÇİMİ */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1, fontWeight: "bold" }}>Renk</Typography>

            {colorOptions.map((col) => (
              <Box
                key={col}
                onClick={() => setSelectedColor(col)}
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 1,
                  mr: 1,
                  mb: 1,
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    selectedColor === col ? "2px solid #1976d2" : "1px solid #ccc",
                  backgroundColor:
                    selectedColor === col
                      ? "rgba(25,118,210,0.15)"
                      : "#f7f7f7",
                  fontWeight: selectedColor === col ? "bold" : "normal",
                  transition: "0.2s",
                }}
              >
                {col}
              </Box>
            ))}
          </Box>

          {/* 🔥 BEDEN SEÇİMİ */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1, fontWeight: "bold" }}>Bedenler</Typography>

            {sizeOptions.map((size) => (
              <Box
                key={size}
                onClick={() => toggleSize(size)}
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 1,
                  mr: 1,
                  mb: 1,
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: selectedSizes.includes(size)
                    ? "2px solid #1976d2"
                    : "1px solid #ccc",
                  backgroundColor: selectedSizes.includes(size)
                    ? "rgba(25,118,210,0.15)"
                    : "#f7f7f7",
                  fontWeight: selectedSizes.includes(size) ? "bold" : "normal",
                  transition: "0.2s",
                }}
              >
                {size}
              </Box>
            ))}
          </Box>

          <TextField
            fullWidth
            label="Stok"
            type="number"
            margin="normal"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Açıklama"
            multiline
            minRows={3}
            margin="normal"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <TextField
            select
            fullWidth
            margin="normal"
            label="Kategori"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
          >
            <MenuItem value="">
              <em>Seçiniz</em>
            </MenuItem>

            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          {/* FOTOĞRAFLAR */}
          <Box mt={3}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Ürün Fotoğrafları
            </Typography>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setGalleryFiles(files);
                  setPreviewImages(
                    Array.from(files).map((f) => URL.createObjectURL(f))
                  );
                }
              }}
            />

            {previewImages.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                {previewImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    width={90}
                    height={90}
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box mt={4}>
            <Button type="submit" variant="contained" fullWidth>
              Kaydet
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
