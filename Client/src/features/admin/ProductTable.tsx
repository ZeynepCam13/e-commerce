// Client/src/features/admin/ProductTable.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import requests from "../../api/requests";
import { IProduct } from "../../model/IProduct";

interface Props {
  onEdit: (product: IProduct) => void;
}

export default function ProductTable({ onEdit }: Props) {
  const [products, setProducts] = useState<IProduct[]>([]);

  const loadProducts = () => {
    requests.Catalog.list().then((data) => setProducts(data));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu ürünü silmek istediğine emin misin?")) {
      try {
        await requests.Admin.deleteProduct(id);
        toast.success("Ürün başarıyla silindi!");
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
            <TableCell>Marka</TableCell>
            <TableCell>Kategori</TableCell>
            <TableCell>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>₺{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.category?.name}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onEdit(product)}
                  sx={{ mr: 1 }}
                >
                  Düzenle
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(product.id)}
                >
                  Sil
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
