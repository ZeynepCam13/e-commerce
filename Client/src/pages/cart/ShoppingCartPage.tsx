import { AddCircleOutline, Delete, RemoveCircleOutline } from "@mui/icons-material";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Alert,
  Typography,
} from "@mui/material";
import { useCartContext } from "../../../context/CartContext";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import requests from "../../api/requests";
import { toast } from "react-toastify";
import CartSummary from "./Cartsummary";
import { currenyTRY } from "../../utils/formatCurrency";

export default function ShoppingCartPage() {
  const { cart, setCart } = useCartContext();
  const [status, setStatus] = useState({loading:false,id:" "});

  // Ürün ekleme
  function handleAddItem(productId: number,id:string) {
    setStatus({loading:true,id:id});
    requests.Cart.addItem(productId)
      .then((cart) => setCart(cart))
      .catch((error) => console.log(error))
      .finally(() => setStatus({loading:false,id:""}));
  }

  // Ürün azaltma
  function handleDeleteItem(productId: number,id:string, quantity: number = 1) {
    setStatus({loading:true,id:id});
    requests.Cart.deleteItem(productId, quantity)
      .then((cart) => {setCart(cart);
      })
      .catch((error) => console.log(error))
      .finally(() => setStatus({loading:false,id:""}));
  }

  // Eğer cart yoksa veya ürün listesi boşsa
  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return <Alert severity="warning">Sepetinizde ürün yok</Alert>;
  }

  // Toplam fiyat hesapla
  const total = cart?.cartItems?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) ?? 0;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Ürün Resmi</TableCell>
            <TableCell>Ürün</TableCell>
            <TableCell align="right">Fiyat</TableCell>
            <TableCell align="right">Adet</TableCell>
            <TableCell align="right">Toplam</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart?.cartItems?.map((item) => (
            <TableRow
              key={item.productId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <img
                  src={`http://localhost:5198/${item.imageUrl}`}
                  style={{ height: 60 }}
                  alt={item.name}
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">{ currenyTRY.format(item.price)}</TableCell>
              <TableCell align="right">
                <LoadingButton
                  loading={status.loading && status.id=="add"+item.productId}
                  onClick={() => handleAddItem(item.productId,"add"+item.productId)}
                >
                  <AddCircleOutline />
                </LoadingButton>
                {item.quantity}
                <LoadingButton
                  loading={status.loading && status.id=="add"+item.productId}
                  onClick={() => handleDeleteItem(item.productId,"del"+item.productId)}
                >
                  <RemoveCircleOutline />
                </LoadingButton>
              </TableCell>
              <TableCell align="right">
                {currenyTRY.format(item.price * item.quantity) }
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="error"
                  onClick={() =>{ 
                    handleDeleteItem(item.productId,"del"+item.productId,item.quantity);
                    toast.error("ürün sepetinizden silindi");
                }}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {/* Toplam satırı */}
          <TableRow>
            <TableCell colSpan={4} align="right">
              <Typography variant="h6" fontWeight="bold">
                Sepet Toplamı:
              </Typography>
            </TableCell>
            <TableCell align="right" colSpan={2}>
              <Typography variant="h6" fontWeight="bold">
                {currenyTRY.format(total)}
              </Typography>
            </TableCell>
          </TableRow>
          {/*cart summary*/}
          <CartSummary/>
        </TableBody>
      </Table>
    </TableContainer>
  );
}


