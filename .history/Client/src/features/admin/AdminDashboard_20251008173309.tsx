import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

export default function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Yönetici Paneli
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowForm(!showForm)}
        sx={{ mb: 2 }}
      >
        {showForm ? "Ürün Listesine Dön" : "Yeni Ürün Ekle"}
      </Button>

      {showForm ? <ProductForm /> : <ProductTable />}
    </Box>
  );
}
