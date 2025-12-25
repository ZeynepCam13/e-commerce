import { 
  Button, CircularProgress, Dialog, DialogActions, DialogContent, 
  DialogTitle, IconButton, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography, Box, Stack, 
  Chip, Divider, Grid, Container 
} from "@mui/material";
import { useEffect, useState } from "react";
import { Order } from "../../model/IOrder";
import requests from "../../api/requests";
import { currenyTRY } from "../../utils/formatCurrency";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const statusToText: Record<number, string> = {
  0: "Sipariş Alındı",
  1: "Hazırlanıyor",
  2: "Kargoya Verildi",
  3: "Siparişiniz Tamamlandı"
};

// Durumlar için renkli etiket fonksiyonu
const getStatusChip = (status: any) => {
  const s = Number(status);
  switch (s) {
    case 0: return <Chip label="Alındı" size="small" variant="outlined" />;
    case 1: return <Chip label="Hazırlanıyor" size="small" color="info" />;
    case 2: return <Chip label="Kargoda" size="small" color="secondary" />;
    case 3: return <Chip label="Tamamlandı" size="small" color="success" />;
    default: return <Chip label="Beklemede" size="small" />;
  }
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  // Hesaplamalar
  const subTotal = selectedOrder?.orderItems.reduce((toplam, item) => toplam + (item.quantity * item.price), 0) ?? 0;
  const tax = subTotal * 0.2;
  const total = subTotal + tax;

  function handleDialogOpen(order: Order) {
    setOpen(true);
    setSelectedOrder(order);
  }

  function handleDialogClose() {
    setOpen(false);
    setSelectedOrder(null);
  }

  useEffect(() => {
    setLoading(true);
    requests.Order.getOrders()
      .then(orders => setOrders(orders))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={10}><CircularProgress color="inherit" /></Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="800" mb={4} sx={{ letterSpacing: -1 }}>
        Siparişlerim
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee", borderRadius: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#fafafa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Sipariş No</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Durum</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tarih</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Toplam Tutar</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{getStatusChip(order.orderStatus)}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{currenyTRY.format(order.subTotal)}</TableCell>
                <TableCell align="right">
                  <Button 
                    onClick={() => handleDialogOpen(order)} 
                    size="small" 
                    variant="outlined" 
                    endIcon={<ArrowRightIcon />}
                    sx={{ borderRadius: 2, color: "black", borderColor: "#ddd" }}
                  >
                    Detaylar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DETAY DİYALOGU */}
      <Dialog onClose={handleDialogClose} open={open} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ m: 0, p: 3, fontWeight: 800 }}>
          Sipariş Detayı #{selectedOrder?.id}
          <IconButton onClick={handleDialogClose} sx={{ position: "absolute", right: 16, top: 16 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 4, bgcolor: "#fafafa" }}>
          <Grid container spacing={3}>
            {/* Teslimat Bilgileri Kartı */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  TESLİMAT BİLGİLERİ
                </Typography>
                <Typography fontWeight="700" variant="body1">
                  {selectedOrder?.firstName} {selectedOrder?.lastName}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{selectedOrder?.phone}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedOrder?.addresLine} <br /> {selectedOrder?.city}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
                  <LocalShippingIcon fontSize="small" />
                  <Typography variant="caption" fontWeight="700">
                    {statusToText[Number(selectedOrder?.orderStatus)]}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            {/* Ürün Listesi */}
            <Grid item xs={12} md={7}>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee", borderRadius: 3 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#fff" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Ürün</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Adet</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Toplam</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder?.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <img src={`http://localhost:5198/${item.productImage}`} alt="" style={{ height: 45, width: 35, objectFit: 'cover', borderRadius: 4 }} />
                            <Typography variant="caption" fontWeight="600">{item.productName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{currenyTRY.format(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Fiyat Özeti */}
              <Box sx={{ mt: 3, p: 2, bgcolor: "#fff", borderRadius: 2, border: "1px solid #eee" }}>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption">Ara Toplam</Typography>
                    <Typography variant="caption" fontWeight="600">{currenyTRY.format(subTotal)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption">Vergi (%20)</Typography>
                    <Typography variant="caption" fontWeight="600">{currenyTRY.format(tax)}</Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" fontWeight="800">Toplam</Typography>
                    <Typography variant="body1" fontWeight="800" color="primary.main">{currenyTRY.format(total)}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleDialogClose} sx={{ color: "black", fontWeight: 700 }}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}