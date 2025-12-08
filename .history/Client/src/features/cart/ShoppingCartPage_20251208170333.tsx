import { Link } from "react-router"; 
import { Alert, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { AddCircleOutline, Delete, RemoveCircleOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import CartSummary from "./Cartsummary";
import { currenyTRY } from "../../utils/formatCurrency";
import { addItemToCart, deleteItemFromCart } from "./cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export default function ShoppingCartPage() {
  const { cart, status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  if (!cart || cart.cartItems.length === 0)
    return <Alert severity="warning">Sepetinizde ürün yok</Alert>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Beden</TableCell>
              <TableCell align="right">Fiyat</TableCell>
              <TableCell align="right">Adet</TableCell>
              <TableCell align="right">Toplam</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cart.cartItems.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>
                  <img
                    src={`http://localhost:5198/${item.imageUrl}`}
                    style={{ height: 60 }}
                  />
                </TableCell>

                <TableCell>
                  {item.name}
                </TableCell>
                <TableCell>
                  {item.size.toUpperCase()};
                </TableCell>

                <TableCell align="right">
                  {currenyTRY.format(item.price)}
                </TableCell>

                <TableCell align="right">
                  {/* + Butonu */}
                  <LoadingButton
                    loading={
                      status ===
                      "pendingAddItem" + item.productId + item.size
                    }
                    onClick={() =>
                      dispatch(
                        addItemToCart({
                          productId: item.productId,
                          size: item.size, // ✔ DOĞRU OLAN BU
                        })
                      )
                    }
                  >
                    <AddCircleOutline />
                  </LoadingButton>

                  {item.quantity}

                  {/* - Butonu */}
                  <LoadingButton
                    loading={
                      status ===
                      "pendingDeleteItem" + item.productId + item.size
                    }
                    onClick={() =>
                      dispatch(
                        deleteItemFromCart({
                          productId: item.productId,
                          quantity: 1,
                          size:item.size
                          
                        })
                      )
                    }
                  >
                    <RemoveCircleOutline />
                  </LoadingButton>
                </TableCell>

                <TableCell align="right">
                  {currenyTRY.format(item.price * item.quantity)} ₺
                </TableCell>

                {/* TÜMÜNÜ SİL */}
                <TableCell align="right">
                  <LoadingButton
                    color="error"
                    loading={
                      status ===
                      "pendingDeleteItem" + item.productId + item.size + "all"
                    }
                    onClick={() =>
                      dispatch(
                        deleteItemFromCart({
                          productId: item.productId,
                          quantity: item.quantity,
                          size:item.size
                          
                        })
                      )
                    }
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}

            <CartSummary />
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
          component={Link}
          to="/checkout"
          variant="contained"
          color="primary"
          sx={{
            minWidth: "200px",
            height: "30px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Ödeme
        </Button>
      </Box>
    </>
  );
}
