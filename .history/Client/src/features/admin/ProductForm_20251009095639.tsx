// Client/src/features/admin/ProductForm.tsx
import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import requests from "../../api/requests";
import { toast } from "react-toastify";

interface Props {
  product: any;
  cancelEdit: () => void;
}

export default function ProductForm({ product, cancelEdit }: Props) {
  const [formData, setFormData] = useState(
    product ?? { name: "", price: "", stock: "", categoryId: "" }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        {product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
      </Typography>
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
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Stok"
        type="number"
        value={formData.stock}
        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Kategori ID"
        type="number"
        value={formData.categoryId}
        onChange={(e) =>
          setFormData({ ...formData, categoryId: e.target.value })
        }
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" type="submit" sx={{ mr: 2 }}>
          Kaydet
        </Button>
        <Button variant="outlined" color="secondary" onClick={cancelEdit}>
          İptal
        </Button>
      </Box>
    </Box>
  );
}
