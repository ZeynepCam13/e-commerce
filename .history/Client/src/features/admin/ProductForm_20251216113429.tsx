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

  const [colors, setColors] = useState([
    { colorName: "", colorCode: "#000000", stock: "" },
  ]);

  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<any[]>([]);

  // 🔹 Edit mode
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
    }
  }, [product]);

  // 🔹 Categories
  useEffect(() => {
    axios.get("category/tree").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const selected = categories.find(
      (c) => c.id === Number(formData.categoryId)
    );
    setSubCategories(selected?.subCategories || []);
  }, [formData.categoryId, categories]);

  // 🔹 Submit
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
    form.append("SubSubCategoryId", String(formData.subSubCategoryId));

    sizes.forEach((s, i) => {
      form.append(`Sizes[${i}].Size`, s.size);
      form.append(`Sizes[${i}].Stock`, s.stock);
    });

    colors.forEach((c, i) => {
      form.append(`Colors[${i}].ColorName`, c.colorName);
      form.append(`Colors[${i}].ColorCode`, c.colorCode);
      form.append(`Colors[${i}].Stock`, c.stock || "0");
    });

    if (galleryFiles) {
      Array.from(galleryFiles).forEach((file) =>
        form.append("Images", file)
      );
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
      <Paper sx={{ p: 4, width: 520 }}>
        <Typography variant="h5" mb={3}>
          {product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Ad" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

          <TextField fullWidth label="Fiyat" type="number" value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })} />

          <TextField fullWidth label="Stok" type="number" value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />

          <TextField fullWidth label="Açıklama" multiline minRows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            } />

          {/* KATEGORİLER */}
          <TextField select fullWidth label="Kategori" value={formData.categoryId}
            onChange={(e) =>
              setFormData({
                ...formData,
                categoryId: e.target.value,
                subCategoryId: "",
                subSubCategoryId: "",
              })
            }>
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
              }>
              {subCategories.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
          )}

          {selectedSubCategory && (
            <TextField select fullWidth label="Alt-Alt Kategori"
              value={formData.subSubCategoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subSubCategoryId: Number(e.target.value),
                })
              }>
              {selectedSubCategory.subSubCategories.map((ss) => (
                <MenuItem key={ss.id} value={ss.id}>{ss.name}</MenuItem>
              ))}
            </TextField>
          )}

          {/* 🟣 RENKLER */}
          <Box mt={3}>
            <Typography fontWeight="bold">Renkler</Typography>

            {colors.map((c, i) => (
              <Box key={i} display="flex" gap={1} mt={1}>
                <input
                  type="color"
                  value={c.colorCode}
                  onChange={(e) => {
                    const copy = [...colors];
                    copy[i].colorCode = e.target.value;
                    setColors(copy);
                  }}
                />

                <TextField label="Ad" value={c.colorName}
                  onChange={(e) => {
                    const copy = [...colors];
                    copy[i].colorName = e.target.value;
                    setColors(copy);
                  }} />

                <TextField label="Stok" type="number" value={c.stock}
                  onChange={(e) => {
                    const copy = [...colors];
                    copy[i].stock = e.target.value;
                    setColors(copy);
                  }} />

                <Button color="error" onClick={() =>
                  setColors(colors.filter((_, idx) => idx !== i))
                }>Sil</Button>
              </Box>
            ))}

            <Button onClick={() =>
              setColors([...colors, { colorName: "", colorCode: "#000000", stock: "" }])
            }>
              + Renk Ekle
            </Button>
          </Box>

          {/* 🟢 BEDENLER */}
          <Box mt={3}>
            <Typography fontWeight="bold">Bedenler</Typography>

            {sizes.map((s, i) => (
              <Box key={i} display="flex" gap={1}>
                <TextField label="Beden" value={s.size}
                  onChange={(e) => {
                    const copy = [...sizes];
                    copy[i].size = e.target.value;
                    setSizes(copy);
                  }} />
                <TextField label="Stok" type="number" value={s.stock}
                  onChange={(e) => {
                    const copy = [...sizes];
                    copy[i].stock = e.target.value;
                    setSizes(copy);
                  }} />
              </Box>
            ))}
          </Box>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Kaydet
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
