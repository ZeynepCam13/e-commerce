import { Link } from "react-router"; 
import { Alert, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Stack, Container } from "@mui/material";
import { Add, Remove, DeleteOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import CartSummary from "./Cartsummary";
import { currenyTRY } from "../../utils/formatCurrency";
import { addItemToCart, deleteItemFromCart } from "./cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export default function ShoppingCartPage() {
  const { cart, status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  if (!cart || cart.cartItems.length === 0)
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>Sepetiniz şu an boş. Alışverişe devam etmek için ana sayfaya dönebilirsiniz.</Alert>
        <Button component={Link} to="/catalog" variant="contained" sx={{ mt: 3, bgcolor: 'black' }}>Alışverişe Başla</Button>
      </Container>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="800" mb={4} sx={{ letterSpacing: -1 }}>
        Alışveriş Sepetim ({cart.cartItems.length} Ürün)
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee", borderRadius: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#fafafa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Ürün</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Beden</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Fiyat</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Adet</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Toplam</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cart.cartItems.map((item) => (
              <TableRow key={item.productId + item.size} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <img
                      src={`http://localhost:5198/${item.imageUrl}`}
                      alt={item.name}
                      style={{ height: 80, width: 60, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="600">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Ürün ID: #{item.productId}</Typography>
                    </Box>
                  </Stack>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", px: 1.5, py: 0.5, borderRadius: 1, display: "inline-block" }}>
                    {item.size.toUpperCase()}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  {currenyTRY.format(item.price)}
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                    <LoadingButton
                      size="small"
                      loading={status === "pendingDeleteItem" + item.productId + item.size}
                      onClick={() => dispatch(deleteItemFromCart({ productId: item.productId, quantity: 1, size: item.size }))}
                      sx={{ minWidth: 30, p: 0, color: "black" }}
                    >
                      <Remove fontSize="small" />
                    </LoadingButton>

                    <Typography fontWeight="700" sx={{ minWidth: 20, textAlign: "center" }}>
                      {item.quantity}
                    </Typography>

                    <LoadingButton
                      size="small"
                      loading={status === "pendingAddItem" + item.productId + item.size}
                      onClick={() => dispatch(addItemToCart({ productId: item.productId, size: item.size }))}
                      sx={{ minWidth: 30, p: 0, color: "black" }}
                    >
                      <Add fontSize="small" />
                    </LoadingButton>
                  </Stack>
                </TableCell>

                <TableCell align="right">
                  <Typography fontWeight="800">
                    {currenyTRY.format(item.price * item.quantity)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <LoadingButton
                    color="error"
                    loading={status === "pendingDeleteItem" + item.productId + item.size + "all"}
                    onClick={() => dispatch(deleteItemFromCart({ productId: item.productId, quantity: item.quantity, size: item.size }))}
                  >
                    <DeleteOutline />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <Box sx={{ width: { xs: "100%", md: "400px" } }}>
           <CartSummary />
           <Button
              component={Link}
              to="/checkout"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                bgcolor: "black",
                color: "white",
                py: 2,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontWeight: "800",
                "&:hover": { bgcolor: "#333" }
              }}
            >
              ÖDEME ADIMINA GEÇ
            </Button>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={2}>
              KDV ve kargo ücretleri bir sonraki adımda hesaplanacaktır.
            </Typography>
        </Box>
      </Box>
    </Container>
  );
}