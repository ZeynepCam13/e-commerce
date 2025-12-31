import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Grid,
  Divider,
  IconButton,
  Stack,
  Container,
  CircularProgress
} from "@mui/material";
import { Delete, Add, CloudUpload, ColorLens, Straighten, SmartToy } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { ICategory } from "../../model/ICategory";
import AiProductContentButton from "./AiProductContentButton";

interface Props {
  product?: any;
  cancelEdit: () => void;
}

export default function ProductForm({ product, cancelEdit }: Props) {
  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    marka: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    categoryId: "",
    subCategoryId: "",
    subSubCategoryId: "",
    stock: "0"
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false); // AI Analiz durumu
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [sizes, setSizes] = useState([{ size: "", stock: "" }]);
  const [colors, setColors] = useState([{ colorName: "", colorCode: "#000000" }]);

  // AI Vision Analiz Fonksiyonu
  const handleAiVisionAnalyze = async () => {
    if (!galleryFiles || galleryFiles.length === 0) {
      toast.warn("Lütfen önce en az bir fotoğraf seçin!");
      return;
    }

    setIsAnalyzing(true);
    const visionForm = new FormData();
    visionForm.append("file", galleryFiles[0]); // İlk fotoğrafı gönder

    try {
      // Backend'deki analyze-image metoduna istek atıyoruz
      const res = await axios.post("ai/analyze-image", visionForm);
      
      // Backend string JSON dönerse parse etmemiz gerekebilir
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

      setFormData((prev: any) => ({
        ...prev,
        name: data.name || prev.name,
        description: data.description || prev.description,
        price: data.price || prev.price,
      }));
      
      toast.success("AI Ürünü başarıyla analiz etti ve formu doldurdu!");
    } catch (error) {
      console.error(error);
      toast.error("Görsel analiz edilemedi. Backend metodunu kontrol edin.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        marka: product.marka,
        stock: product.stock,
        description: product.description,
        categoryId: product.categoryId,
        subCategoryId: product.subCategory?.id || "",
        subSubCategoryId: product.subSubCategory?.id || "",
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
      });
      setOldImages(product.images || []);
    }
  }, [product]);

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

  const selectedCategory = categories.find((c) => c.id == formData.categoryId);
  const selectedSubCategory = selectedCategory?.subCategories?.find((sc) => sc.id == formData.subCategoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("Name", formData.name);
    form.append("Price", formData.price);
    form.append("Description", formData.description);
    form.append("Stock", formData.stock);
    form.append("marka", formData.marka);
    form.append("SubSubCategoryId", String(formData.subSubCategoryId));
    form.append("SeoTitle", formData.seoTitle);
    form.append("SeoDescription", formData.seoDescription);

    sizes.forEach((s, i) => {
      form.append(`Sizes[${i}].Size`, s.size);
      form.append(`Sizes[${i}].Stock`, s.stock);
    });
    colors.forEach((c, i) => {
      form.append(`Colors[${i}].ColorName`, c.colorName);
      form.append(`Colors[${i}].ColorCode`, c.colorCode);
    });
    if (galleryFiles) {
      for (let i = 0; i < galleryFiles.length; i++) {
        form.append("Images", galleryFiles[i]);
      }
    }

    try {
      if (product) {
        await axios.put(`/products/${product.id}`, form);
        toast.success("Ürün güncellendi!");
      } else {
        await axios.post("/products", form);
        toast.success("Ürün eklendi!");
      }
      cancelEdit();
    } catch { toast.error("Hata oluştu!"); }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="800">
            {product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </Typography>
          <Button onClick={cancelEdit} color="inherit" variant="outlined">İptal</Button>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📦 Temel Bilgiler
          </Typography>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Ürün Adı" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Marka" value={formData.marka} onChange={(e) => setFormData({ ...formData, marka: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Fiyat (₺)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Genel Stok" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
               <Box sx={{ position: 'relative' }}>
                  <TextField fullWidth label="Ürün Açıklaması" multiline rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  <Box sx={{ mt: 1 }}>
                    <AiProductContentButton 
                      name={formData.name} marka={formData.marka} categoryId={formData.subSubCategoryId}
                      onGenerated={(data) => setFormData((prev: any) => ({ ...prev, description: data.description, seoTitle: data.seoTitle, seoDescription: data.seoDescription }))} 
                    />
                  </Box>
               </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
          {/* Kategori ve SEO Bölümleri aynı kalıyor... */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="primary" gutterBottom>📂 Kategori Seçimi</Typography>
              <Stack spacing={2}>
                <TextField select fullWidth label="Ana Kategori" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subCategoryId: "", subSubCategoryId: "" })}>
                  {categories.map((cat) => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                </TextField>
                {selectedCategory && (
                  <TextField select fullWidth label="Alt Kategori" value={formData.subCategoryId} onChange={(e) => setFormData({ ...formData, subCategoryId: Number(e.target.value), subSubCategoryId: "" })}>
                    {subCategories.map((sub) => <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>)}
                  </TextField>
                )}
                {selectedSubCategory && (
                  <TextField select fullWidth label="Alt-Alt Kategori" value={formData.subSubCategoryId} onChange={(e) => setFormData({ ...formData, subSubCategoryId: Number(e.target.value) })}>
                    {selectedSubCategory.subSubCategories?.map((ss) => <MenuItem key={ss.id} value={ss.id}>{ss.name}</MenuItem>)}
                  </TextField>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="primary" gutterBottom>🔍 SEO Ayarları</Typography>
              <Stack spacing={2}>
                <TextField fullWidth label="SEO Başlığı" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} />
                <TextField fullWidth label="SEO Açıklaması" multiline rows={2} value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} />
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
          {/* Renk ve Beden Bölümleri aynı kalıyor... */}
          <Grid container spacing={4} mb={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ColorLens fontSize="small" /> Renkler
              </Typography>
              {colors.map((c, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center" mb={1}>
                  <input type="color" value={c.colorCode} onChange={(e) => { const u = [...colors]; u[index].colorCode = e.target.value; u[index].colorName = e.target.value; setColors(u); }} style={{ width: 40, height: 40, border: '1px solid #ddd', cursor: 'pointer' }} />
                  <TextField size="small" label="Renk Adı" value={c.colorName} onChange={(e) => { const u = [...colors]; u[index].colorName = e.target.value; setColors(u); }} />
                  <IconButton color="error" onClick={() => setColors(colors.filter((_, i) => i !== index))}><Delete /></IconButton>
                </Stack>
              ))}
              <Button startIcon={<Add />} size="small" onClick={() => setColors([...colors, { colorName: "", colorCode: "#000000" }])}>Renk Ekle</Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Straighten fontSize="small" /> Bedenler
              </Typography>
              {sizes.map((s, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center" mb={1}>
                  <TextField size="small" label="Beden" value={s.size} onChange={(e) => { const u = [...sizes]; u[index].size = e.target.value; setSizes(u); }} />
                  <TextField size="small" label="Stok" type="number" value={s.stock} onChange={(e) => { const u = [...sizes]; u[index].stock = e.target.value; setSizes(u); }} />
                  <IconButton color="error" onClick={() => setSizes(sizes.filter((_, i) => i !== index))}><Delete /></IconButton>
                </Stack>
              ))}
              <Button startIcon={<Add />} size="small" onClick={() => setSizes([...sizes, { size: "", stock: "" }])}>Beden Ekle</Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUpload /> Fotoğraflar
          </Typography>
          
          {product && oldImages.length > 0 && (
            <Box mb={3}>
              <Typography variant="caption" display="block" mb={1}>MEVCUT FOTOĞRAFLAR</Typography>
              <Stack direction="row" spacing={1}>
                {oldImages.map((img: any) => (
                  <Box key={img.id} component="img" src={`http://localhost:5198/${img.imageUrl}`} sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, border: '1px solid #eee' }} />
                ))}
              </Stack>
            </Box>
          )}

          <Box sx={{ border: '2px dashed #ccc', p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#fafafa' }}>
            <input type="file" multiple accept="image/*" id="file-upload" style={{ display: 'none' }} onChange={(e) => {
              const files = e.target.files;
              setGalleryFiles(files);
              setPreviewImages(files ? Array.from(files).map((f) => URL.createObjectURL(f)) : []);
            }} />
            
            <Stack direction="row" spacing={2} justifyContent="center">
                <label htmlFor="file-upload">
                  <Button component="span" variant="outlined" startIcon={<CloudUpload />}>Dosya Seçin</Button>
                </label>
                
                {galleryFiles && galleryFiles.length > 0 && (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleAiVisionAnalyze}
                    disabled={isAnalyzing}
                    startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <SmartToy />}
                    sx={{ bgcolor: '#7c4dff', '&:hover': { bgcolor: '#651fff' } }}
                  >
                    {isAnalyzing ? "AI Analiz Ediyor..." : "AI ile Formu Doldur"}
                  </Button>
                )}
            </Stack>

            {previewImages.length > 0 && (
              <Stack direction="row" spacing={1} mt={2} justifyContent="center">
                {previewImages.map((img, i) => (
                  <Box key={i} component="img" src={img} sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }} />
                ))}
              </Stack>
            )}
          </Box>

          <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 6, py: 2, fontWeight: 'bold', fontSize: '1.1rem' }}>
            {product ? "DEĞİŞİKLİKLERİ KAYDET" : "ÜRÜNÜ SİSTEME EKLE"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}