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

export default function ProductDetails() {
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

  // --- ZOOM PANEL STATE ---
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const zoomLevel = 3;

  // --- BEDEN SEÇİMİ ---
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (!product && id) dispatch(fetchProductById(parseInt(id)));
  }, [id, product, dispatch]);

  useEffect(() => {
    if (product) {
      dispatch(fetchComments(product.id));
    }
  }, [product, dispatch]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !product) return;
    await dispatch(
      addComment({ productId: Number(product.id), text: commentText })
    );
    setCommentText("");
  };

  if (loading === "pendingFetchProductById") return <CircularProgress />;
  if (!product) return <NotFound />;

  const discountedPrice =
    product.discount && product.discount > 0 ? product.price : product.price;

  const originalPrice =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice
      : null;

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => `http://localhost:5198/${img.imageUrl}`)
      : [`http://localhost:5198/${product.imageUrl}`];

  return (
    <Stack direction="row" spacing={4}>
      {/* === KOLON 1: SOL ÜRÜN RESİMLERİ + LENS === */}
      <Box sx={{ width: 500 }}>
        <ProductImageSlider
          images={galleryImages}
          onZoomImageChange={(img, pos) => {
            setZoomImg(img);
            setZoomPos(pos);
          }}
        />
      </Box>

      {/* === KOLON 2: TRENDYOL ZOOM PANELİ === */}
      {zoomImg && (
        <Box
          sx={{
            position: "absolute",
            left: "750px",
            top: "120px",
            width: 500,
            height: 600,
            overflow: "hidden",
            borderRadius: 2,
            border: "1px solid #ddd",
            background: "#fff",
            zIndex: 50,
            display: { xs: "none", md: "block" },
          }}
        >
          <img
            src={zoomImg}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `
                scale(${zoomLevel})
                translate(
                  ${-(zoomPos.x / 500) * 100}%,
                  ${-(zoomPos.y / 500) * 100}%
                )
              `,
              transformOrigin: "top left",
            }}
          />
        </Box>
      )}

      {/* === KOLON 3: ÜRÜN BİLGİLERİ === */}
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
              <TableRow>
                <TableCell>Renk</TableCell>
                <TableCell>{product.color ?? "—"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* BEDEN SEÇİMİ */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Beden Seçiniz:
          </Typography>

          {product.sizes ? (
            product.sizes.split(",").map((size) => (
              <Box
                key={size}
                onClick={() => setSelectedSize(size)}
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 1,
                  mr: 1,
                  mb: 1,
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    selectedSize === size ? "2px solid red" : "1px solid #ccc",
                  backgroundColor:
                    selectedSize === size ? "rgba(255,0,0,0.08)" : "#f7f7f7",
                  fontWeight: selectedSize === size ? "bold" : "normal",
                  transition: "0.2s",
                }}
              >
                {size}
              </Box>
            ))
          ) : (
            <Typography>Beden bilgisi yok.</Typography>
          )}
        </Box>

        {/* SEPETE EKLE */}
        <LoadingButton
          variant="outlined"
          loadingPosition="start"
          startIcon={<AddShoppingCart />}
          loading={status === "pendingAddItem" + product.id}
          onClick={() => {
            if (!selectedSize) {
              alert("Lütfen bir beden seçiniz.");
              return;
            }

            dispatch(
              addItemToCart({
                productId: product.id,
                size: selectedSize, // 🔥 seçilen beden sepete gidiyor
              } as any) // (tip takılmazsan burayı kaldırırsın)
            );
          }}
          sx={{ mt: 3 }}
        >
          Sepete Ekle
        </LoadingButton>

        {item?.quantity! > 0 && (
          <Typography sx={{ mt: 1 }}>
            Sepetinize {item?.quantity} adet eklendi
          </Typography>
        )}

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

        {/* YORUM YAZ */}
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
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Yorum yapmak için giriş yapmalısınız.
          </Typography>
        )}
      </Box>
    </Box>
  </Stack>
  );
}
