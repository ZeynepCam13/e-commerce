import { CircularProgress, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Box } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router";
import NotFound from "../../errors/NotFound";
import { LoadingButton } from "@mui/lab";
import { AddShoppingCart } from "@mui/icons-material";
import { currenyTRY } from "../../utils/formatCurrency";
import { fetchProductById, selectProductById } from "./catalogSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addItemToCart } from "../cart/cartSlice";

export default function ProductDetailsPage() {
  const { cart, status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector((state) => selectProductById(state, Number(id)));
  const { status: loading } = useAppSelector((state) => state.catalog);

  const item = cart?.cartItems.find((i) => i.productId == product?.id);

  useEffect(() => {
    if (!product && id) dispatch(fetchProductById(parseInt(id)));
  }, [id]); // product'ı bilerek eklemedik

  if (loading === "pendingFetchProductById") return <CircularProgress />;
  if (!product) return <NotFound />;

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={6}>
      {/* Sol: Görsel */}
      <Box sx={{ width: { xs: "100%", md: "45%", lg: "33%" } }}>
        <img
          src={`http://localhost:5198${product.imageUrl}`}
          style={{ width: "100%", display: "block" }}
        />
      </Box>

      {/* Sağ: Bilgiler */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          {currenyTRY.format(product.price)} ₺
        </Typography>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stock</TableCell>
                <TableCell>{product.stock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="center">
          <LoadingButton
            variant="outlined"
            loadingPosition="start"
            startIcon={<AddShoppingCart />}
            loading={status === "pendingAddItem" + product.id}
            onClick={() => dispatch(addItemToCart({ productId: product.id }))}
          >
            Sepete Ekle
          </LoadingButton>

          {item?.quantity! > 0 && (
            <Typography variant="body2">
              Sepetinize {item?.quantity} adet eklendi
            </Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
