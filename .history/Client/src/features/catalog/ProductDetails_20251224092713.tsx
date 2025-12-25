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
import { fetchComments, addComment } from "../comments/commentSlice";
import ProductImageSlider from "./ProductImageSlider";
import { addItemToCart } from "../cart/cartSlice";
import { fetchSimilarProducts } from "../../api/ai";

export default function ProductDetails() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const product = useAppSelector((state) =>
    selectProductById(state, Number(id))
  );
  const { status: loading } = useAppSelector((state) => state.catalog);
  const { cart, status } = useAppSelector((state) => state.cart);
  const { comments } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.account);

  const item = cart?.cartItems.find((i) => i.productId === product?.id);

  const [commentText, setCommentText] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Zoom
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const zoomLevel = 3;

  useEffect(() => {
    if (!product && id) dispatch(fetchProductById(+id));
  }, [id, product, dispatch]);

  useEffect(() => {
    if (!product?.id) return;
    setLoadingSimilar(true);
    fetchSimilarProducts(product.id)
      .then(setSimilarProducts)
      .finally(() => setLoadingSimilar(false));
  }, [product?.id]);

  useEffect(() => {
    if (product) dispatch(fetchComments(product.id));
  }, [product, dispatch]);

  useEffect(() => {
    if (product?.productColors?.length) {
      const first =
        product.productColors.find((c) => c.stock > 0) ||
        product.productColors[0];
      setSelectedColorId(first?.id ?? null);
    }
  }, [product]);

  if (loading === "pendingFetchProductById") return <CircularProgress />;
  if (!product) return <NotFound />;

  const galleryImages =
    product.images?.length
      ? product.images.map((i) => `http://localhost:5198/${i.imageUrl}`)
      : [`http://localhost:5198/${product.imageUrl}`];

  return (
    <>
      {/* ===================== */}
      {/* 🔹 ÜRÜN DETAYLARI */}
      {/* ===================== */}
      <Stack direction="row" spacing={4}>
        {/* SOL */}
        <Box sx={{ width: 500 }}>
          <ProductImageSlider
            images={galleryImages}
            onZoomImageChange={(img, pos) => {
              setZoomImg(img);
              setZoomPos(pos);
            }}
          />
        </Box>

        {/* SAĞ */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3">{product.name}</Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="h4" color="secondary">
            {currenyTRY.format(product.price)} ₺
          </Typography>

          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Marka</TableCell>
                  <TableCell>{product.marka}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* RENK */}
          <Box mt={3}>
            <Typography>Renk Seçin</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              {product.productColors?.map((c) => (
                <Box
                  key={c.id}
                  onClick={() => c.stock > 0 && setSelectedColorId(c.id)}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: c.colorCode,
                    border:
                      selectedColorId === c.id
                        ? "3px solid black"
                        : "1px solid #ccc",
                    opacity: c.stock === 0 ? 0.4 : 1,
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* BEDEN */}
          <Box mt={3}>
            <Typography>Beden Seçin</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              {product.productSizes?.map((s) => (
                <Box
                  key={s.id}
                  onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                  sx={{
                    px: 2,
                    py: 1,
                    border:
                      selectedSize === s.size
                        ? "2px solid black"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  {s.size}
                </Box>
              ))}
            </Box>
          </Box>

          {/* SEPET */}
          <LoadingButton
            sx={{ mt: 3 }}
            startIcon={<AddShoppingCart />}
            loading={status === "pendingAddItem"}
            onClick={() =>
              dispatch(
                addItemToCart({
                  productId: product.id,
                  quantity: 1,
                  size: selectedSize,
                  colorId: selectedColorId!,
                })
              )
            }
          >
            Sepete Ekle
          </LoadingButton>

          {item && (
            <Typography mt={1}>Sepette {item.quantity} adet var</Typography>
          )}

          {/* YORUMLAR */}
          <Box mt={5}>
            <Typography variant="h6">Yorumlar</Typography>
            {comments.map((c) => (
              <Paper key={c.id} sx={{ p: 1, mb: 1 }}>
                <Typography fontWeight="bold">{c.username}</Typography>
                <Typography>{c.text}</Typography>
              </Paper>
            ))}

            {user && (
              <>
                <TextField
                  fullWidth
                  multiline
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <LoadingButton
                  sx={{ mt: 1 }}
                  onClick={() =>
                    dispatch(addComment({ productId: product.id, text: commentText }))
                  }
                >
                  Gönder
                </LoadingButton>
              </>
            )}
          </Box>
        </Box>
      </Stack>

      {/* ===================== */}
      {/* 🔥 BENZER ÜRÜNLER */}
      {/* ===================== */}
      <Box sx={{ mt: 10 }}>
        <Typography variant="h5" mb={3}>
          Benzer Ürünler
        </Typography>

        {loadingSimilar && <CircularProgress />}

        <Box sx={{ display: "flex", gap: 3, overflowX: "auto" }}>
          {similarProducts.map((p) => (
            <Paper
              key={p.id}
              sx={{
                width: 220,
                p: 1.5,
                flexShrink: 0,
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={() => (window.location.href = `/catalog/${p.id}`)}
            >
              <Box
                component="img"
                src={`http://localhost:5198/${p.imageUrl}`}
                sx={{ width: "100%", height: 160, objectFit: "cover", mb: 1 }}
              />
              <Typography fontWeight={600} noWrap>
                {p.name}
              </Typography>
              <Typography color="text.secondary">
                {currenyTRY.format(p.price)}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
}
