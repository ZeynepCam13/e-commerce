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
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  product?: any;          // 🔥 Edit modu için product artık opsiyonel
  cancelEdit: () => void;
}

type Category = { id: number; name: string };

export default function ProductForm({ product, cancelEdit }: Props) {
  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
  });

  const [color, setColor] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const sizeOptions = ["S", "M", "L", "XL"];

  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<any[]>([]); // 🔥 Edit modunda mevcut resimler
  const [categories, setCategories] = useState<Category[]>([]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  // 🟦 Edit Modu Başlangıç Değerleri
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        categoryId: product.categoryId,
      });

      setColor(product.color || "");
      setSelectedSizes(product.sizes ? product.sizes.split(",") : []);
      setOldImages(product.images || []);
    }
  }, [product]);

  // 🟦 Kategorileri Yükle
  useEffect(() => {
    const loadCategories = async () => {
      const res = await requests.Catalog.getCategories();
      setCategories(res);
    };
    loadCategories();
  }, []);

  // 🔥 FORM GÖNDERME (Hem Create hem Update destekli)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      selectedSizes.length === 0 ||
      !color
    ) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    const form = new FormData();

    form.append("Name", formData.name);
    form.append("Price", formData.price);
    form.append("Stock", formData.stock);
    form.append("Description", formData.description);
    form.append("CategoryId", formData.categoryId);
    form.append("Color", color);
    form.append("Sizes", selectedSizes.join(",")); // 🔥 burada bedenler ekleniyor

    if (galleryFiles) {
      for (let i = 0; i < galleryFiles.length; i++) {
        form.append("Images", galleryFiles[i]);
      }
    }

    try {
      if (product) {
        // 🔥 Edit Mode → PUT
        await axios.put(`/products/${product.id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Ürün başarıyla güncellendi!");
      } else {
        // 🔥 Create Mode → POST
        await axios.post("/products", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Ürün başarıyla eklendi!");
      }

      cancelEdit();
    } catch {
      toast.error("Bir hata oluştu!");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* --- AD --- */}
          <TextField
            fullWidth
            label="Ad"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            margin="normal"
          />

          {/* --- FİYAT --- */}
          <TextField
            fullWidth
            label="Fiyat"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            margin="normal"
          />

          {/* --- RENK --- */}
          <TextField
            fullWidth
            label="Renk"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            margin="normal"
          />

          {/* --- BEDENLER --- */}
          <Box sx={{ mt: 2 }}>
            <Typography fontWeight="bold" sx={{ mb: 1 }}>
              Bedenler
            </Typography>
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
                    ? "2px solid black"
                    : "1px solid #ccc",
                  backgroundColor: selectedSizes.includes(size)
                    ? "rgba(0,0,0,0.1)"
                    : "#f7f7f7",
                }}
              >
                {size}
              </Box>
            ))}
          </Box>

          {/* --- STOK --- */}
          <TextField
            fullWidth
            label="Stok"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            margin="normal"
          />

          {/* --- AÇIKLAMA --- */}
          <TextField
            fullWidth
            label="Açıklama"
            multiline
            minRows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
          />

          {/* --- KATEGORİ --- */}
          <TextField
            fullWidth
            select
            label="Kategori"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            margin="normal"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          {/* --- MEVCUT RESİMLER (EDIT MODE) --- */}
          {product && oldImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography fontWeight="bold">Mevcut Fotoğraflar</Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                {oldImages.map((img: any) => (
                  <img
                    key={img.id}
                    src={`http://localhost:5198/${img.imageUrl}`}
                    width={80}
                    height={80}
                    style={{
                      objectFit: "cover",
                      border: "1px solid #ddd",
                      borderRadius: 4,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* --- YENİ RESİMLER --- */}
          <Box mt={3}>
            <Typography fontWeight="bold">Yeni Fotoğraflar</Typography>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                setGalleryFiles(files);
                setPreviewImages(
                  files ? Array.from(files).map((f) => URL.createObjectURL(f)) : []
                );
              }}
            />

            {previewImages.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {previewImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    width={80}
                    height={80}
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

          {/* --- KAYDET BUTONU --- */}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            {product ? "Güncelle" : "Kaydet"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
