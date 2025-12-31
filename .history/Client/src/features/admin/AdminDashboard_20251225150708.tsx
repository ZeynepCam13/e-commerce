import { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, Paper, Divider, Grid } from "@mui/material";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router";
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { TrendingUp, ShoppingBag, Payments, Inventory } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Örnek Grafik Verisi (Backend bağlanana kadar)
const mockData = [
  { name: 'Pzt', sales: 400 }, { name: 'Sal', sales: 700 }, { name: 'Çar', sales: 500 },
  { name: 'Per', sales: 900 }, { name: 'Cum', sales: 1100 }, { name: 'Cmt', sales: 1500 }, { name: 'Paz', sales: 1300 }
];

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
      {/* BAŞLIK VE BUTONLAR */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>Yönetim Paneli</Typography>
          <Typography variant="body2" color="text.secondary">Genel durum analizi ve ürün yönetimi.</Typography>
        </Box>

        {!editMode && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ bgcolor: "black", borderRadius: 2, px: 3, "&:hover": { bgcolor: "#333" } }}>
              Yeni Ürün
            </Button>
            <Button variant="outlined" startIcon={<ListAltIcon />} onClick={() => navigate("/admin/orders")} sx={{ borderRadius: 2, borderColor: "#ddd", color: "black", "&:hover": { borderColor: "black", bgcolor: "#f5f5f5" } }}>
              Siparişler
            </Button>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {!editMode ? (
        <>
          {/* İSTATİSTİK KARTLARI */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <StatCard title="Toplam Kazanç" value="₺45.250" icon={<Payments color="primary" />} />
            <StatCard title="Aktif Siparişler" value="12" icon={<ShoppingBag color="secondary" />} />
            <StatCard title="Düşük Stoklu Ürünler" value="3" icon={<Inventory color="error" />} />
            <StatCard title="Haftalık Artış" value="+%18" icon={<TrendingUp color="success" />} />
          </Grid>

          {/* SATIŞ GRAFİĞİ */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: "1px solid #eee", borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Haftalık Satış Trendi</Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="sales" stroke="black" strokeWidth={3} dot={{ r: 4, fill: "black" }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* ÜRÜN TABLOSU */}
          <Paper elevation={0} sx={{ border: "1px solid #eee", borderRadius: 3, overflow: "hidden" }}>
            <ProductTable onEdit={handleEdit} />
          </Paper>
        </>
      ) : (
        /* ÜRÜN EKLEME/DÜZENLEME FORMU */
        <Paper elevation={0} sx={{ p: 4, border: "1px solid #eee", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            {selectedProduct ? "Ürünü Düzenle" : "Yeni Ürün Tanımla"}
          </Typography>
          <ProductForm product={selectedProduct} cancelEdit={handleCancel} />
        </Paper>
      )}
    </Box>
  );
}

// Kart Bileşeni
function StatCard({ title, value, icon }: any) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #eee", borderRadius: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ bgcolor: "#f8f9fa", p: 1, borderRadius: 2 }}>{icon}</Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">{title}</Typography>
            <Typography variant="h6" fontWeight="800">{value}</Typography>
          </Box>
        </Stack>
      </Paper>
    </Grid>
  );
}