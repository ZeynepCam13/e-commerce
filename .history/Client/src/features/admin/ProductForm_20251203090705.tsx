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

export default function ProductForm({ product, cancelEdit }: Props) {
  
  const [formData, setFormData] = useState<any>({
    id: product?.id ?? 0,
    name: product?.name ?? "",
    price: product?.price ?? "",
    stock: product?.stock ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? "",
    imageUrl: product?.imageUrl ?? "",
  });

  
  const [file, setFile] = useState<File | null>(null);

 
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

 
  const [categories, setCategories] = useState<Category[]>([]);

  
  useEffect(() => {
    setFormData({
      id: product?.id ?? 0,
      name: product?.name ?? "",
      price: product?.price ?? "",
      stock: product?.stock ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId ?? "",
      imageUrl: product?.imageUrl ?? "",
    });
  }, [product]);

  
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
      try {
        const res = await requests.Admin.uploadImage(file);
        setFormData((prev: any) => ({ ...prev, imageUrl: res.data.imageUrl }));
        
        formData.imageUrl = res.data.imageUrl;
      } catch {
        toast.error("Kapak görseli yüklenemedi!");
        return;
      }
    }

    
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId:
        formData.categoryId === "" ? null : Number(formData.categoryId),
    };

    try {
      if (product) {
        await requests.Admin.updateProduct(payload);
        toast.success("Ürün güncellendi!");
      } else {
        await requests.Admin.createProduct(payload);
        toast.success("Ürün eklendi!");
      }
      cancelEdit();
    } catch {
      toast.error("İşlem başarısız!");
    }
  };

  
  const handleUploadGallery = async () => {
    if (!galleryFiles || galleryFiles.length === 0) {
      toast.error("Lütfen galeri için görsel seçin!");
      return;
    }
    if (!formData.id && !product?.id) {
      toast.error("Önce ürünü kaydedin, sonra galeri yükleyin!");
      return;
    }

    const galleryFormData = new FormData();
    for (let i = 0; i < galleryFiles.length; i++) {
      galleryFormData.append("files", galleryFiles[i]);
    }

    try {
      // axios.defaults.baseURL = "http://localhost:5198/api" ise sadece "products/.." yaz
      const id = product?.id ?? formData.id;
      await axios.post(`products/${id}/images`, galleryFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Galeri fotoğrafları yüklendi!");

      
      setGalleryFiles(null);
      setPreviewImages([]);
    } catch {
      toast.error("Fotoğraf yükleme başarısız!");
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
          maxWidth: 520,
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
            label="Açıklama"
            multiline
            minRows={2}
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

          {/* Kapak Görseli */}
          <Box mt={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Kapak Fotoğrafı
            </Typography>

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

          
          <Box mt={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Galeri Fotoğrafları (çoklu yükleme)
            </Typography>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setGalleryFiles(files);
                  const previews = Array.from(files).map((f) =>
                    URL.createObjectURL(f)
                  );
                  setPreviewImages(previews);
                }
              }}
            />

            {previewImages.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                {previewImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                ))}
              </Box>
            )}

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={handleUploadGallery}
              disabled={!galleryFiles || (product ? false : !formData.id)}
            >
              Fotoğrafları Yükle
            </Button>
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
