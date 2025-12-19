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
import { ICategory } from "../../model/ICategory"; // Bu interface'in içeriği korunmuştur.


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
    subSubCategoryId: ""
  });
  // 'any' yerine ISubCategory[] kullanmak daha iyi olsa da, isteğiniz üzerine 'any[]' korundu.
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<any[]>([]);
  // ICategory'nin subCategories property'sine sahip olduğu varsayımıyla 'any[]' korundu.
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [sizes, setSizes] = useState([
    { size: "", stock: "" }
  ]);
  const [colors, setColors] = useState([
    { colorName: "", colorCode: "#000000", stock: "" }
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
        subCategoryId: product.subCategory?.id || "",
        subSubCategoryId: product.subSubCategory?.id || "",
      });

      setOldImages(product.images || []);
    }
  }, [product]);

  // Kategorileri yükle
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get("category/tree");
        setCategories(res.data);
      } catch (error) {
        toast.error("Kategoriler yüklenirken hata oluştu.");
      }
    };

    loadCategories();
  }, []);

  // Seçili kategoriye göre alt kategorileri ayarla
  useEffect(() => {
    const selected = categories.find(c => c.id === Number(formData.categoryId));
    // Orijinal kodunuzdaki varsayılan category yapısını korur.
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

    // Kategori Hiyerarşisini Belirleme
    // Eğer SubSubCategory seçiliyse onu, değilse SubCategory'yi, o da değilse CategoryId'yi gönderiyoruz.
    const finalCategoryId = formData.subSubCategoryId || formData.subCategoryId || formData.categoryId;
    if (finalCategoryId) {
        form.append("SubSubCategoryId", String(finalCategoryId));
    }


    sizes.forEach((s, index) => {
      form.append(`Sizes[${index}].Size`, s.size);
      form.append(`Sizes[${index}].Stock`, s.stock);

    });

    colors.forEach((c, index) => {
      form.append(`Colors[${index}].ColorName`, c.colorName);
      form.append(`Colors[${index}].ColorCode`, c.colorCode);
      form.append(`Colors[${index}].Stock`, c.stock);
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
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu!");
    }
  };

  // Kategori seçimi nesnelerini bulma
  const selectedCategory = categories.find(
    (c) => c.id == formData.categoryId
  );

  const selectedSubCategory = selectedCategory?.subCategories?.find(
    (sc: any) => sc.id == formData.subCategoryId
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
          {/* CATEGORY DROPDOWN  (1. SEVİYE) */}
          {/* ---------------------------------------- */}
          <TextField
            fullWidth
            select
            label="Kategori"
            value={formData.categoryId || ""}
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
          {/* SUBCATEGORY DROPDOWN (2. SEVİYE) */}
          {/* ---------------------------------------- */}
          {selectedCategory && (
            <TextField
              fullWidth
              select
              label="Alt Kategori"
              value={formData.subCategoryId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData, subCategoryId: Number(e.target.value), subSubCategoryId: ""
                })
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
          {/* SUBSUBCATEGORY DROPDOWN (3. SEVİYE) */}
          {/* ---------------------------------------- */}
          {selectedSubCategory && selectedSubCategory.subSubCategories?.length > 0 && (
            <TextField
              fullWidth
              select
              label="Alt-Alt Kategori"
              value={formData.subSubCategoryId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subSubCategoryId: Number(e.target.value),
                })
              }
              margin="normal"
            >
              {selectedSubCategory.subSubCategories?.map((ss: any) => (
                <MenuItem key={ss.id} value={ss.id}>
                  {ss.name}
                </MenuItem>
              ))}
            </TextField>
          )}


          {/* 🟣 RENKLER */}
          <Box mt={3}>
            <Typography fontWeight="bold">Renkler</Typography>

            {colors.map((c, i) => (
              <Box key={i} display="flex" gap={1} mt={1} alignItems="center">
                <input
                  type="color"
                  value={c.colorCode}
                  onChange={(e) => {
                    const copy = [...colors];
                    copy[i].colorCode = e.target.value;
                    setColors(copy);
                  }}
                  style={{ width: 40, height: 40, border: "none" }}
                />

                <TextField
                  label="Ad"
                  size="small"
                  value={c.colorName}
                  onChange={(e) => {
                    const copy = [...colors];
                    copy[i].colorName = e.target.value;
                    setColors(copy);
                  }}
                  sx={{ flexGrow: 1 }}
                />

                <TextField
                  label="Stok"
                  type="number"
                  size="small"
                  value={c.stock}
                  onChange={(e) => {
                    const copy = [...colors];
                    copy[i].stock = e.target.value;
                    setColors(copy);
                  }}
                  sx={{ width: 80 }}
                />

                <Button color="error" onClick={() =>
                  setColors(colors.filter((_, idx) => idx !== i))
                }>Sil</Button>
              </Box>
            ))}

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() =>
                setColors([...colors, { colorName: "", colorCode: "#000000", stock: "" }])
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
                  size="small"
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
                  size="small"
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
              <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                {oldImages.map((img: any) => (
                  <img
                    key={img.id}
                    src={`http://localhost:5198/${img.imageUrl}`}
                    alt="Mevcut ürün fotoğrafı"
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
              style={{ marginTop: '8px', display: 'block' }}
            />

            {previewImages.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                {previewImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Yeni ürün fotoğrafı önizlemesi ${i + 1}`}
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