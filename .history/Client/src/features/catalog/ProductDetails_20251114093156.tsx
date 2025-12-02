import {
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Box,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import NotFound from "../../errors/NotFound";
import { LoadingButton } from "@mui/lab";
import { AddShoppingCart } from "@mui/icons-material";
import { currenyTRY } from "../../utils/formatCurrency";
import { fetchProductById, selectProductById } from "./catalogSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addItemToCart } from "../cart/cartSlice";
import { fetchComments, addComment } from "../comments/commentSlice";
import ProductImageSlider from "./ProductImageSlider";

export default function ProductDetailsPage() {
  const { cart, status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector((state) =>
    selectProductById(state, Number(id))
  );
  const { status: loading } = useAppSelector((state) => state.catalog);
  const item = cart?.cartItems.find((i) => i.productId == product?.id);

  const { comments } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.account);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!product && id) dispatch(fetchProductById(parseInt(id)));
  }, [id]);

  useEffect(() => {
    if (product) {
      dispatch(fetchComments(product.id));
    }
  }, [product, dispatch]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await dispatch(
      addComment({ productId: Number(product.id), text: commentText })
    );
    setCommentText("");
  };

  if (loading === "pendingFetchProductById") return <CircularProgress />;
  if (!product) return <NotFound />;

  const discountedPrice =
    product.discount && product.discount > 0
      ? product.price
      : product.price;

  const originalPrice =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice
      : null;

  // ✔ Görselleri array haline getiriyoruz
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => `http://localhost:5198/${img.imageUrl}`)
      : [`http://localhost:5198/${product.imageUrl}`];

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={6}>
      {/* SOL TARAFTA - ÜRÜN GÖRSELLERİ */}
      <Box sx={{ width: { xs: "100%", md: "45%", lg: "33%" } }}>
        <ProductImageSlider images={galleryImages} />

        {(product.discount ?? 0) > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: "20px",
              left: "-40px",
              background: "linear-gradient(90deg, #dd2d24ff, #9f0b0b3b)",
              color: "white",
              padding: "6px 40px",
              fontWeight: "bold",
              transform: "rotate(-45deg)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            İNDİRİMLİ ÜRÜN
          </Box>
        )}
      </Box>

      {/* SAĞ TARAFTA - ÜRÜN BİLGİLERİ */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />

        {(product.discount ?? 0) > 0 ? (
          <>
            <Typography
              variant="h6"
              sx={{
                textDecoration: "line-through",
                color: "text.secondary",
              }}
            >
              {currenyTRY.format(
                originalPrice ||
                  product?.price / (1 - (product.discount ?? 0) / 100)
              )}{" "}
              ₺
            </Typography>
            <Typography variant="h4" color="red" sx={{ fontWeight: "bold" }}>
              {currenyTRY.format(discountedPrice)} ₺
            </Typography>
          </>
        ) : (
          <Typography variant="h4" color="secondary">
            {currenyTRY.format(product.price)} ₺
          </Typography>
        )}

        {/* TABLO */}
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>İsim</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Açıklama</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stok</TableCell>
                <TableCell>{product.stock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* SEPETE EKLE */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="center">
          <LoadingButton
            variant="outlined"
            loadingPosition="start"
            startIcon={<AddShoppingCart />}
            loading={status === "pendingAddItem" + product.id}
            onClick={() =>
              dispatch(addItemToCart({ productId: product.id }))
            }
          >
            Sepete Ekle
          </LoadingButton>

          {item?.quantity! > 0 && (
            <Typography variant="body2">
              Sepetinize {item?.quantity} adet eklendi
            </Typography>
          )}
        </Stack>

        {/* YORUMLAR */}
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>
            Yorumlar
          </Typography>

          {comments.length === 0 ? (
            <Typography color="text.secondary">
              Henüz yorum yapılmamış.
            </Typography>
          ) : (
            comments.map((c) => (
              <Paper key={c.id} sx={{ p: 1.5, mb: 1.5 }}>
                <Typography variant="subtitle2">{c.username}</Typography>
                <Typography variant="body2">{c.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(c.createdAt).toLocaleString("tr-TR")}
                </Typography>
              </Paper>
            ))
          )}

          {/* YORUM YAZMA */}
          {user ? (
            <Box mt={2}>
              <TextField
                fullWidth
                label="Yorumunuzu yazın"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                multiline
                minRows={2}
              />
              <LoadingButton
                variant="contained"
                sx={{ mt: 1 }}
                onClick={handleAddComment}
              >
                Gönder
              </LoadingButton>
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Yorum yapmak için giriş yapmalısınız.
            </Typography>
          )}
        </Box>
      </Box>
    </Stack>
  );
}
