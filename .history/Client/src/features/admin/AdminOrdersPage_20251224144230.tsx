import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, TableContainer, Typography, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Chip, Box, Stack, Divider, Avatar
} from "@mui/material";
import requests from "../../api/requests";
import { Order } from "../../model/IOrder";
import { ShoppingBag, Person, CalendarToday, LocalShipping } from "@mui/icons-material";

const statusEnumMap: Record<string, number> = {
  Pending: 0,
  Approved: 1,
  PaymentFailed: 2,
  Completed: 3,
};

// Durumlar için renk ve metin eşleştirmesi
const getStatusBadge = (status: number) => {
  switch (status) {
    case 0: return <Chip label="Beklemede" color="warning" size="small" variant="outlined" />;
    case 1: return <Chip label="Hazırlanıyor" color="info" size="small" />;
    case 2: return <Chip label="Kargoya Verildi" color="secondary" size="small" />;
    case 3: return <Chip label="Teslim Edildi" color="success" size="small" />;
    default: return <Chip label="Bilinmiyor" size="small" />;
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<number>(0);

  useEffect(() => {
    requests.Order.listAll().then((data) => setOrders(data));
  }, [open]);

  useEffect(() => {
    if (selectedOrder) {
      const stringStatus = selectedOrder.orderStatus;
      const numericStatus = statusEnumMap[String(stringStatus)];
      setNewStatus(numericStatus);
    }
  }, [selectedOrder]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    await requests.Order.updateStatus(selectedOrder.id, newStatus);
    const updated = await requests.Order.listAll();
    setOrders(updated);
    setOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#fcfcfc", minHeight: "100vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>
            Tüm Siparişler
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistemdeki aktif ve geçmiş siparişlerin takibi.
          </Typography>
        </Box>
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee", borderRadius: 3, overflow: "hidden" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: "#fafafa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Müşteri</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tarih</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Toplam Tutar</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Durum</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell>#{o.id}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 30, height: 30, fontSize: "0.8rem", bgcolor: "primary.light" }}>
                      {o.userName?.[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>{o.userName}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{new Date(o.orderDate).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{o.subTotal.toLocaleString("tr-TR")} ₺</TableCell>
                <TableCell align="center">
                  {getStatusBadge(Number(o.orderStatus))}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedOrder(o);
                      setOpen(true);
                    }}
                    sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" }, borderRadius: 1.5, textTransform: "none" }}
                  >
                    Detaylar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* SİPARİŞ DETAY DİYALOGU */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Sipariş Detayı #{selectedOrder?.id}
          <Box>{selectedOrder && getStatusBadge(Number(selectedOrder.orderStatus))}</Box>
        </DialogTitle>

        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Müşteri Bilgileri</Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1}><Person fontSize="small" color="action" /><Typography variant="body2">{selectedOrder.userName}</Typography></Stack>
                  <Stack direction="row" spacing={1}><CalendarToday fontSize="small" color="action" /><Typography variant="body2">{new Date(selectedOrder.orderDate).toLocaleDateString()}</Typography></Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Durum Güncelleme</Typography>
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth size="small">
                    <Select value={newStatus} onChange={(e) => setNewStatus(Number(e.target.value))}>
                      <MenuItem value={0}>Sipariş Alındı</MenuItem>
                      <MenuItem value={1}>Hazırlanıyor</MenuItem>
                      <MenuItem value={2}>Kargoya Verildi</MenuItem>
                      <MenuItem value={3}>Teslim Edildi</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" size="small" onClick={handleStatusUpdate} sx={{ bgcolor: "black" }}>Güncelle</Button>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingBag fontSize="small" /> Sipariş Kalemleri
                </Typography>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#fafafa" }}>
                    <TableRow>
                      <TableCell>Ürün</TableCell>
                      <TableCell align="center">Adet</TableCell>
                      <TableCell align="right">Fiyat</TableCell>
                      <TableCell align="right">Toplam</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">{item.price} ₺</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{item.price * item.quantity} ₺</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ border: 0, pt: 3 }}><Typography fontWeight={700}>Genel Toplam:</Typography></TableCell>
                      <TableCell align="right" sx={{ border: 0, pt: 3 }}><Typography fontWeight={800} color="primary.main" variant="h6">{selectedOrder.subTotal} ₺</Typography></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "black", fontWeight: 700 }}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// İlgili Grid importunu eklemeyi unutmayın
import { Grid } from "@mui/material";