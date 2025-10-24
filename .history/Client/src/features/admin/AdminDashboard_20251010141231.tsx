// Client/src/features/admin/AdminDashboard.tsx
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router";


export default function AdminDashboard() {
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    setSelectedProduct(null);
    setEditMode(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedProduct(null);
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
            sx={{ mb: 2, mr:2
            }}
            onClick={handleCreate}
          >
            Yeni Ürün Ekle
          </Button>
           <Button 
        variant="contained" 
        sx={{mb:2}}
        onClick={() => navigate("/admin/orders")}
      >
        Siparişleri Görüntüle
      </Button>
          <ProductTable onEdit={handleEdit} />
        </>
      ) : (
        <ProductForm product={selectedProduct} cancelEdit={handleCancel} />
      )}
    </Box>
  );
}
