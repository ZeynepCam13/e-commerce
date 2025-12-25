import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, TableContainer, Typography, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import requests from "../../api/requests";
import { Order } from "../../model/IOrder";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] =  useState<number>(0);

  // Siparişleri çek
  useEffect(() => {
    requests.Order.listAll().then(data => setOrders(data));
  }, []);

  // Dialog açılınca mevcut durumu dropdown'a yaz
  useEffect(() => {
    if (selectedOrder) 
      setNewStatus(selectedOrder.orderStatus); // number → number
    
    
  }, [selectedOrder]);

  // Durumu güncelle
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    await requests.Order.updateStatus(selectedOrder.id, Number(newStatus));

    // Güncellenmiş listeyi tekrar çek
    const updated = await requests.Order.listAll();
    setOrders(updated);

    setOpen(false);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h5" p={2} fontWeight={600}>
        Tüm Siparişler
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Müşteri</strong></TableCell>
            <TableCell><strong>Tarih</strong></TableCell>
            <TableCell><strong>Tutar</strong></TableCell>
            <TableCell><strong>Durum</strong></TableCell>
            <TableCell><strong>Detay</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map(o => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.userName}</TableCell>
              <TableCell>{new Date(o.orderDate).toLocaleDateString()}</TableCell>
              <TableCell>{o.subTotal} ₺</TableCell>
              <TableCell>{o.orderStatus}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSelectedOrder(o);
                    setOpen(true);
                  }}
                >
                  Görüntüle
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Sipariş Detayı</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Müşteri:</strong> {selectedOrder.userName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Tarih:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Durum:</strong> {selectedOrder.orderStatus}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Tutar:</strong> {selectedOrder.subTotal} ₺
              </Typography>

              {/* DROPDOWN */}
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Durum</InputLabel>
                <Select
                  value={newStatus}
                  label="Durum"
                  onChange={(e) => setNewStatus(Number(e.target.value))}
                >
                  <MenuItem value={0}>Beklemede</MenuItem>
                  <MenuItem value={1}>Hazırlanıyor</MenuItem>
                  <MenuItem value={2}>Kargoya Verildi</MenuItem>
                  <MenuItem value={3}>Teslim Edildi</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleStatusUpdate}
              >
                Güncelle
              </Button>

              {/* Ürün Listesi */}
              <Table size="small" sx={{ mt: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Ürün</strong></TableCell>
                    <TableCell><strong>Adet</strong></TableCell>
                    <TableCell><strong>Birim Fiyat</strong></TableCell>
                    <TableCell><strong>Toplam</strong></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {selectedOrder.orderItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price} ₺</TableCell>
                      <TableCell>{item.price * item.quantity} ₺</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
