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

interface Props {
  products: IProduct[];
  onEdit: (product: IProduct) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
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
              <TableCell>
                {product.category?.name ?? "-"}
              </TableCell>

              <TableCell align="right">
                <IconButton onClick={() => onEdit(product)}>
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => onDelete(product.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
