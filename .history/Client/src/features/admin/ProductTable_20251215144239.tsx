import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { ICategory } from "../../model/ICategory";

interface Props {
  product?: any;
  cancelEdit: () => void;
}

interface ColorForm {
  colorName: string;
  colorCode: string;
  stock: string;
}

export default function ProductForm({ product, cancelEdit }: Props) {
  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    subSubCategoryId: "",
  });

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const [sizes, setSizes] = useState([{ size: "", stock: "" }]);

  // 🔵 RENKLER
  const [colors, setColors] = useState<ColorForm[]>([]);
  const [colorInput, setColorInput] = useState<ColorForm>({
    colorName: "",
    colorCode: "#000000",
    stock: "",
  });

  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<any[]>([]);

  // Edit mode
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        categoryId: product.categoryId,
        subCategoryId: product.subCategory?.id || "",
        subSubCategoryId: product.subSubCategory?.id || "",
      });

      setOldImages(product.images || []);

      // 🔵 Mevcut renkleri doldur
      if (product.productColors) {
        setColors(
          product.productColors.map((c: any) => ({
            colorName: c.colorName,
            colorCode: c.colorCode,
            stock: String(c.stock),
          }))
        );
      }
    }
  }, [product]);

  // Kategoriler
  useEffect(() => {
    axios.get("category/tree").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const selected = categories.find(
      (c) => c.id === Number(formData.categoryId)
    );
    setSubCategories(selected?.subCategories || []);
  }, [formData.categoryId, categories]);

  // 🟢 RENK EKLE
  const addColor = () => {
    if (!colorInput.colorName || !colorInput.stock) return;

    setColors([...colors, colorInput]);
    setColorInput({ colorName: "", colorCode: "#000000", stock: "" });
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();

    form.append("Name", formData.name);
    form.append("Price", formData.price);
    form.append("Stock", formData.stock);
    form.append("Description", formData.description);
    form.append("SubSubCategoryId", String(formData.subSubCategoryId));

    // 🟢 BEDENLER
    sizes.forEach((s, i) => {
      form.append(`Sizes[${i}].Size`, s.size);
      form.append(`Sizes[${i}].Stock`, s.stock);
    });

    // 🔵 RENKLER
    colors.forEach((c, i) => {
      form.append(`Colors[${i}].ColorName`, c.colorName);
      form.append(`Colors[${i}].ColorCode`, c.colorCode);
      form.append(`Colors[${i}].Stock`, c.stock);
    });

    // Resimler
    if (galleryFiles) {
      Array.from(galleryFiles).forEach((f) => form.append("Images", f));
    }

    try {
      if (product) {
        await axios.put(`/products/${product.id}`, form);
        toast.success("Ürün güncellendi");
      } else {
        await axios.post("/products", form);
        toast.success("Ürün eklendi");
      }
      cancelEdit();
    } catch {
      toast.error("Bir hata oluştu");
    }
  };

  const selectedCategory = categories.find(
    (c) => c.id == formData.categoryId
  );

  const selectedSubCategory = selectedCategory?.subCategories?.find(
    (sc) => sc.id == formData.subCategoryId
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper sx={{ p: 4, width: 550 }}>
        <Typography variant="h5" mb={3}>
          {product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Ad" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />

          <TextField fullWidth label="Fiyat" type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            margin="normal"
          />

          <TextField fullWidth label="Stok" type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            margin="normal"
          />

          <TextField fullWidth label="Açıklama" multiline minRows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />

          {/* KATEGORİLER */}
          <TextField select fullWidth label="Kategori"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({
                ...formData,
                categoryId: e.target.value,
                subCategoryId: "",
                subSubCategoryId: "",
              })
            }
            margin="normal"
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>

          {selectedCategory && (
            <TextField select fullWidth label="Alt Kategori"
              value={formData.subCategoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subCategoryId: Number(e.target.value),
                  subSubCategoryId: "",
                })
              }
              margin="normal"
            >
              {subCategories.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
          )}

          {selectedSubCategory && (
            <TextField select fullWidth label="Alt-Alt Kategori"
              value={formData.subSubCategoryId}
              onChange={(e) =>
                setFormData({ ...formData, subSubCategoryId: Number(e.target.value) })
              }
              margin="normal"
            >
              {selectedSubCategory.subSubCategories.map((ss: any) => (
                <MenuItem key={ss.id} value={ss.id}>{ss.name}</MenuItem>
              ))}
            </TextField>
          )}

          {/* 🔵 RENKLER */}
          <Box mt={3}>
            <Typography fontWeight="bold">Renkler</Typography>

            <Box display="flex" gap={1} mt={1}>
              <TextField
                label="Renk Adı"
                value={colorInput.colorName}
                onChange={(e) =>
                  setColorInput({ ...colorInput, colorName: e.target.value })
                }
              />
              <input
                type="color"
                value={colorInput.colorCode}
                onChange={(e) =>
                  setColorInput({ ...colorInput, colorCode: e.target.value })
                }
              />
              <TextField
                label="Stok"
                type="number"
                value={colorInput.stock}
                onChange={(e) =>
                  setColorInput({ ...colorInput, stock: e.target.value })
                }
                sx={{ width: 100 }}
              />
              <Button onClick={addColor}>Ekle</Button>
            </Box>

            {colors.map((c, i) => (
              <Box key={i} display="flex" alignItems="center" gap={2} mt={1}>
                <Box sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: c.colorCode,
                }} />
                <Typography>{c.colorName}</Typography>
                <Typography>Stok: {c.stock}</Typography>
                <Button color="error" onClick={() => removeColor(i)}>Sil</Button>
              </Box>
            ))}
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 4 }}>
            {product ? "Güncelle" : "Kaydet"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
