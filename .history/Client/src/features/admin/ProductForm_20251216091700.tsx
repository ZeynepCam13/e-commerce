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
    subCategoryId:"",
    subSubCategoryId:""
  });
 const [subCategories, setSubCategories] = useState<any[]>([]);

  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [sizes, setSizes] = useState([
  { size: "", stock: "" }
]);
  const [colors, setColors] = useState([
  { colorName: "", colorCode: "#000000" }
]);



  // Edit modu başlangıcı
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        categoryId: product.categoryId,
        subCategoryId:product.subCategory?.id||"",
        subSubCategoryId: product.subSubCategory?.id||"",
      });

      setOldImages(product.images || []);
    }
  }, [product]);

  // Kategorileri yükle
  useEffect(() => {
    const loadCategories = async () => {
  const res = await axios.get("category/tree");
  setCategories(res.data);
};

    loadCategories();
  }, []);
useEffect(() => {
  const selected = categories.find(c => c.id === Number(formData.categoryId));
  setSubCategories(selected?.subCategories || []);
}, [formData.categoryId, categories]);

  // Form gönderme
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
    sizes.forEach((s, index) => {
  form.append(`Sizes[${index}].Size`, s.size);
  form.append(`Sizes[${index}].Stock`, s.stock);
  
});

colors.forEach((c, index) => {
  form.append(`ProductColors[${index}].ColorName`, c.colorName);
  form.append(`ProductColors[${index}].ColorCode`, c.colorCode);
});



    if (galleryFiles) {
      for (let i = 0; i < galleryFiles.length; i++) {
        form.append("Images", galleryFiles[i]);
      }
    }

    try {
      if (product) {
        await axios.put(`/products/${product.id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Ürün başarıyla güncellendi!");
      } else {
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
  const selectedCategory = categories.find(
    (c) => c.id == formData.categoryId
  );

  const selectedSubCategory = selectedCategory?.subCategories?.find(
    (sc) => sc.id == formData.subCategoryId
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* AD */}
          <TextField
            fullWidth
            label="Ad"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            margin="normal"
          />

          {/* FİYAT */}
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

          {/* STOK */}
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

          {/* AÇIKLAMA */}
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
          {/* ---------------------------------------- */}
          {/*  CATEGORY DROPDOWN  (1. SEVİYE) */}
          {/* ---------------------------------------- */}
          <TextField
            fullWidth
            select
            label="Kategori"
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
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          {/* ---------------------------------------- */}
          {/*  SUBCATEGORY DROPDOWN (2. SEVİYE) */}
          {/* ---------------------------------------- */}
          {selectedCategory && (
            <TextField
  fullWidth
  select
  label="Alt Kategori"
  value={formData.subCategoryId || ""}
  onChange={(e) =>
    setFormData({
       ...formData,subCategoryId: Number(e.target.value),subSubCategoryId: "" })
  }
  margin="normal"
>
  {subCategories.map((sub) => (
    <MenuItem key={sub.id} value={sub.id}>
      {sub.name}
    </MenuItem>
  ))}
</TextField>

          )}

          {/* ---------------------------------------- */}
          {/*  SUBSUBCATEGORY DROPDOWN (3. SEVİYE) */}
          {/* ---------------------------------------- */}
          {selectedSubCategory && (
            <TextField
              fullWidth
              select
              label="Alt-Alt Kategori"
              value={formData.subSubCategoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subSubCategoryId:Number(e.target.value),
                })
              }
              margin="normal"
            >
              {selectedSubCategory.subSubCategories?.map((ss) => (
                <MenuItem key={ss.id} value={ss.id}>
                  {ss.name}
                </MenuItem>
              ))}
            </TextField>
          )}


         


  {/* 🟣 RENKLER */}
<Box sx={{ mt: 3 }}>
  <Typography fontWeight="bold">Renkler</Typography>

  {colors.map((c, index) => (
    <Box
      key={index}
      sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}
    >
      {/* RENK SEÇİCİ */}
      <input
        type="color"
        value={c.colorCode}
        onChange={(e) => {
          const updated = [...colors];
          updated[index].colorCode = e.target.value;
          updated[index].colorName = e.target.value; // istersek otomatik ad
          setColors(updated);
        }}
        style={{
          width: 40,
          height: 40,
          border: "none",
          cursor: "pointer",
        }}
      />

      {/* RENK ADI */}
      <TextField
        label="Renk Adı"
        value={c.colorName}
        onChange={(e) => {
          const updated = [...colors];
          updated[index].colorName = e.target.value;
          setColors(updated);
        }}
        sx={{ width: 160 }}
      />

      {/* HEX KOD */}
      <TextField
        label="Renk Kodu"
        value={c.colorCode}
        sx={{ width: 120 }}
        InputProps={{ readOnly: true }}
      />

      <Button
        variant="outlined"
        color="error"
        onClick={() => setColors(colors.filter((_, i) => i !== index))}
      >
        Sil
      </Button>
    </Box>
  ))}

  <Button
    variant="outlined"
    sx={{ mt: 2 }}
    onClick={() =>
      setColors([...colors, { colorName: "", colorCode: "#000000" }])
    }
  >
    + Renk Ekle
  </Button>
</Box>

          

          
          {/* 🟢 BEDENLER */}
          <Box sx={{ mt: 3 }}>
            <Typography fontWeight="bold">Bedenler</Typography>

            {sizes.map((item, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, mt: 1 }}>
                <TextField
                  label="Beden"
                  value={item.size}
                  onChange={(e) => {
                    const updated = [...sizes];
                    updated[index].size = e.target.value;
                    setSizes(updated);
                  }}
                  sx={{ width: 120 }}
                />

                <TextField
                  label="Stok"
                  type="number"
                  value={item.stock}
                  onChange={(e) => {
                    const updated = [...sizes];
                    updated[index].stock = e.target.value;
                    setSizes(updated);
                  }}
                  sx={{ width: 120 }}
                />

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    setSizes(sizes.filter((_, i) => i !== index))
                  }
                >
                  Sil
                </Button>
              </Box>
            ))}

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() =>
                setSizes([...sizes, { size: "", stock: "" }])
              }
            >
              + Beden Ekle
            </Button>
          </Box>
          


          {/* EDIT MODU: mevcut resimler */}
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

          {/* YENİ RESİMLER */}
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

          {/* BUTON */}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            {product ? "Güncelle" : "Kaydet"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
