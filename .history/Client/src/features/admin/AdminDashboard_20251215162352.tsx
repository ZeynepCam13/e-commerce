import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router";

import { IProduct } from "../../model/IProduct";
import api from "../../services/api";

export default function AdminDashboard() {
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const navigate = useNavigate();

  // 🔹 ÜRÜNLERİ ÇEK
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get<IProduct[]>("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Ürünler alınamadı", error);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setEditMode(true);
  };

  const handleEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setEditMode(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedProduct(null);
    loadProducts(); // 🔴 geri dönünce tabloyu yenile
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Yönetim Paneli
      </Typography>

      {!editMode ? (
        <>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mb: 2, mr: 2 }}
            onClick={handleCreate}
          >
            Yeni Ürün Ekle
          </Button>

          <Button
            variant="contained"
            sx={{ mb: 2, mr: 2 }}
            onClick={() => navigate("/admin/orders")}
          >
            Siparişleri Görüntüle
          </Button>

          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      ) : (
        <ProductForm
          product={selectedProduct ?? undefined}
          cancelEdit={handleCancel}
        />
      )}
    </Box>
  );
}
