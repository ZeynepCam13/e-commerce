import { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import requests from "../../api/requests";
import { ICategory } from "../../model/ICategory";
import { toast } from "react-toastify";

export default function ProductForm() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });

  useEffect(() => {
    requests.Category.list().then((data) => setCategories(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await requests.Catalog.add(form);
      toast.success("Ürün başarıyla eklendi!");
      setForm({ name: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "" });
    } catch {
      toast.error("Ürün eklenemedi!");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <TextField label="Ürün Adı" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} />
      <TextField label="Açıklama" name="description" fullWidth margin="normal" value={form.description} onChange={handleChange} />
      <TextField label="Fiyat" name="price" type="number" fullWidth margin="normal" value={form.price} onChange={handleChange} />
      <TextField label="Stok" name="stock" type="number" fullWidth margin="normal" value={form.stock} onChange={handleChange} />
      <TextField select label="Kategori" name="categoryId" fullWidth margin="normal" value={form.categoryId} onChange={handleChange}>
        {categories.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField label="Resim URL" name="imageUrl" fullWidth margin="normal" value={form.imageUrl} onChange={handleChange} />
      <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
        Ürün Ekle
      </Button>
    </Box>
  );
}
