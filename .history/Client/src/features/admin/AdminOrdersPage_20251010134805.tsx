import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Typography, Button } from "@mui/material";
import requests from "../../api/requests";
import { Order } from "../../model/IOrder";


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    requests.Order.listAll().then(data => setOrders(data));
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h5" p={2}>Tüm Siparişler</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Müşteri</TableCell>
            <TableCell>Tarih</TableCell>
            <TableCell>Tutar</TableCell>
            <TableCell>Durum</TableCell>
            <TableCell>Detay</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(o => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.id}</TableCell>
              <TableCell>{new Date(o.orderDate).toLocaleDateString()}</TableCell>
              <TableCell>{o.subTotal} ₺</TableCell>
              <TableCell>{o.orderStatus}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small">Görüntüle</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
