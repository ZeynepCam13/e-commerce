import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import requests from "../../api/requests";
import { IProduct } from "../../model/IProduct";
import { toast } from "react-toastify";

export default function ProductTable() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    requests.Catalog.list().then((data) => setProducts(data));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu ürünü silmek istediğine emin misin?")) {
      try {
        await requests.Catalog.delete(id);
        toast.success("Ürün silindi.");
        loadProducts();
      } catch {
        toast.error("Silme işlemi başarısız!");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ürün Listesi
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Ad</TableCell>
            <TableCell>Fiyat</TableCell>
            <TableCell>Stok</TableCell>
            <TableCell>Kategori</TableCell>
            <TableCell>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.price} ₺</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{p.category?.name || "-"}</TableCell>
              <TableCell>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(p.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
