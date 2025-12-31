import { useState } from "react";
import { Box, Button, Typography, Stack, Paper, Divider } from "@mui/material";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router";
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';

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
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#fcfcfc", minHeight: "100vh" }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>
            Yönetim Paneli
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ürün stoklarını, bilgilerini ve siparişleri buradan yönetebilirsiniz.
          </Typography>
        </Box>

        {!editMode && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ 
                bgcolor: "black", 
                borderRadius: 2, 
                px: 3,
                "&:hover": { bgcolor: "#333" } 
              }}
            > 
              Yeni Ürün
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<ListAltIcon />}
              onClick={() => navigate("/admin/orders")}
              sx={{ 
                borderRadius: 2, 
                borderColor: "#ddd", 
                color: "black",
                "&:hover": { borderColor: "black", bgcolor: "#f5f5f5" } 
              }}
            >
              Siparişler
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/admin/istatik")}
              sx={{ 
                bgcolor: "black", 
                borderRadius: 2, 
                px: 3,
                "&:hover": { bgcolor: "#333" } 
              }}
            > 
              Analizler
            </Button>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ mb: 4 }} />
      <Box>
        {!editMode ? (
          <Paper elevation={0} sx={{ border: "1px solid #eee", borderRadius: 3, overflow: "hidden" }}>
            <ProductTable onEdit={handleEdit} />
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ p: 4, border: "1px solid #eee", borderRadius: 3 }}>
             <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                {selectedProduct ? "Ürünü Düzenle" : "Yeni Ürün Tanımla"}
             </Typography>
             <ProductForm product={selectedProduct} cancelEdit={handleCancel} />
          </Paper>
        )}
      </Box>
    </Box>
  );
}