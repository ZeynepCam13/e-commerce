import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IProduct } from "../../model/IProduct";
import axios from "axios";

interface Props {
  onEdit: (product: IProduct) => void;
}

export default function ProductTable({ onEdit }: Props) {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get<IProduct[]>("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Ürünler alınamadı", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Ürün silinsin mi?")) return;

    await axios.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ad</TableCell>
            <TableCell>Fiyat</TableCell>
            <TableCell>Stok</TableCell>
            <TableCell>Kategori</TableCell>
            <TableCell align="right">İşlemler</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price} ₺</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.category?.name ?? "-"}</TableCell>

              <TableCell align="right">
                <IconButton onClick={() => onEdit(product)}>
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => handleDelete(product.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Henüz ürün yok
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
