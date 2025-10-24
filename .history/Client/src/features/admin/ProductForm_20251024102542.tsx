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

interface Props {
  product: any;
  cancelEdit: () => void;
}

export default function ProductForm({ product, cancelEdit }: Props) {
  const [formData, setFormData] = useState(
    product ?? {
      name: "",
      price: "",
      stock: "",
      description: "",
      categoryId: "",
      imageUrl: "",
    }
  );

  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const res = await requests.Admin.uploadImage(file);
      formData.imageUrl = res.data.imageUrl;
    }
    try {
      if (product) {
        await requests.Admin.updateProduct(formData);
        toast.success("Ürün güncellendi!");
      } else {
        await requests.Admin.createProduct(formData);
        toast.success("Ürün eklendi!");
      }
      cancelEdit();
    } catch {
      toast.error("İşlem başarısız!");
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
    
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: 700,
          letterSpacing: 1,
          color: "#222",
          textTransform: "uppercase",
        }}
      >
        Yönetim Paneli
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 2,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: "#444", mb: 2 }}
        >
          {product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Ad"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Fiyat"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Stok"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Marka"
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
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
          </TextField>

          <Box mt={2}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files?.[0] ? e.target.files[0] : null)
              }
            />
            {file && (
              <Typography
                variant="body2"
                sx={{ fontSize: "0.8rem", mt: 1, color: "gray" }}
              >
                Seçilen Dosya: {file.name}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                bgcolor: "#111",
                "&:hover": { bgcolor: "#333" },
                py: 1.2,
              }}
            >
              Kaydet
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={cancelEdit}
              sx={{
                borderColor: "#888",
                color: "#555",
                py: 1.2,
                "&:hover": {
                  borderColor: "#111",
                  color: "#111",
                },
              }}
            >
              İptal
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
