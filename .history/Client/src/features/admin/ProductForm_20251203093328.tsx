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
  product: any;
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

  // ÜRÜN + RESİMLER TEK SEFERDE KAYDEDİLİR
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    const form = new FormData();

    form.append("Name", formData.name);
    form.append("Price", formData.price);
    form.append("Stock", formData.stock);
    form.append("Description", formData.description);
    form.append("CategoryId", formData.categoryId);

    if (galleryFiles) {
      for (let i = 0; i < galleryFiles.length; i++) {
        form.append("Images", galleryFiles[i]); // 🔥 DOĞRU KEY
      }
    }

    try {
      await axios.post("/products", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Ürün ve fotoğraflar başarıyla eklendi!");
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
        justifyContent: "center",
        bgcolor: "#f9f9f9",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 520,
          borderRadius: 2,
        }}
      >
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

          {/* FOTOĞRAF SEÇME */}
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
