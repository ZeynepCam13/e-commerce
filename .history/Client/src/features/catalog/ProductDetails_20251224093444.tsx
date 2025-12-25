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
  const { cart, status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const product = useAppSelector((state) =>
    selectProductById(state, Number(id))
  );

  const { status: loading } = useAppSelector((state) => state.catalog);
  const item = cart?.cartItems.find((i) => i.productId === product?.id);

  const { comments } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.account);

  const [commentText, setCommentText] = useState("");

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Zoom state
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const zoomLevel = 3;

  useEffect(() => {
    if (!product && id) dispatch(fetchProductById(parseInt(id)));
  }, [id, product, dispatch]);

  useEffect(() => {
  if (!product?.id) return;

  setLoadingSimilar(true);

  fetchSimilarProducts(product.id)
    .then(setSimilarProducts)
    .catch(console.error)
    .finally(() => setLoadingSimilar(false));

}, [product?.id]);

  

  useEffect(() => {
    if (product) dispatch(fetchComments(product.id));
  }, [product, dispatch]);

  // 🔵 Default renk seçimi
  useEffect(() => {
    if (product?.productColors?.length) {
      const firstInStock =
        product.productColors.find((c) => c.stock > 0) ||
        product.productColors[0];

      setSelectedColorId(firstInStock?.id ?? null);
    }
  }, [product]);

  const selectedColor = product?.productColors?.find(
    (c) => c.id === selectedColorId
  );

  const handleAddComment = async () => {
    if (!commentText.trim() || !product) return;

    await dispatch(
      addComment({ productId: product.id, text: commentText })
    );
    setCommentText("");
  };

  if (loading === "pendingFetchProductById") return <CircularProgress />;
  if (!product) return <NotFound />;

  const discountedPrice = product.price;

  const originalPrice =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice
      : null;

  const galleryImages =
    product.images?.length
      ? product.images.map((img) => `http://localhost:5198/${img.imageUrl}`)
      : [`http://localhost:5198/${product.imageUrl}`];

  return (
    <Stack direction="row" spacing={4}>
      {/* SOL - Slider */}
      <Box sx={{ width: 500 }}>
        <ProductImageSlider
          images={galleryImages}
          onZoomImageChange={(img, pos) => {
            setZoomImg(img);
            setZoomPos(pos);
          }}
        />
      </Box>

      {/* ZOOM */}
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
              transform: `scale(${zoomLevel}) translate(
                ${-(zoomPos.x / 500) * 100}%,
                ${-(zoomPos.y / 500) * 100}%
              )`,
              transformOrigin: "top left",
            }}
          />
        </Box>
      )}

      {/* SAĞ */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Fiyat */}
        {product.discount ? (
          <>
            <Typography
              sx={{ textDecoration: "line-through", color: "text.secondary" }}
            >
              {currenyTRY.format(originalPrice!)} ₺
            </Typography>
            <Typography variant="h4" color="red" fontWeight="bold">
              {currenyTRY.format(discountedPrice)} ₺
            </Typography>
          </>
        ) : (
          <Typography variant="h4" color="secondary">
            {currenyTRY.format(product.price)} ₺
          </Typography>
        )}

        {/* Ürün Bilgileri */}
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
                <TableCell>Marka</TableCell>
                <TableCell>
                  {product.marka}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* RENK */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" mb={1}>
            Renk Seçin
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {product.productColors?.map((color) => {
              const isSelected = selectedColorId === color.id;
              const isOut = color.stock === 0;

              return (
                <Box
                  key={color.id}
                  onClick={() => !isOut && setSelectedColorId(color.id)}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: color.colorCode,
                    border: isSelected ? "3px solid black" : "1px solid #ccc",
                    opacity: isOut ? 0.4 : 1,
                    cursor: isOut ? "not-allowed" : "pointer",
                  }}
                  title={`${color.colorName} (${color.stock})`}
                />
              );
            })}
          </Box>

          {selectedColor && (
            <Typography sx={{ mt: 1 }} color="green">
              Seçilen renk: {selectedColor.colorName}
            </Typography>
          )}
        </Box>

        {/* BEDEN */}
        <Box sx={{ mt: 3 }}>
          <Typography mb={1}>Beden Seçin</Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {product.productSizes?.map((ps) => (
              <Box
                key={ps.id}
                onClick={() => ps.stock > 0 && setSelectedSize(ps.size)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  border:
                    selectedSize === ps.size
                      ? "2px solid black"
                      : "1px solid #ccc",
                  opacity: ps.stock === 0 ? 0.4 : 1,
                  cursor: ps.stock === 0 ? "not-allowed" : "pointer",
                }}
              >
                {ps.size.toUpperCase()}
              </Box>
            ))}
          </Box>
        </Box>

        {/* SEPET */}
        <LoadingButton
          sx={{ mt: 3 }}
          variant="outlined"
          startIcon={<AddShoppingCart />}
          loading={status === "pendingAddItem"}
          onClick={() => {
            if (!selectedColorId) {
              alert("Lütfen renk seçin");
              return;
            }
            if (!selectedSize) {
              alert("Lütfen beden seçin");
              return;
            }

            dispatch(
              addItemToCart({
                productId: product.id,
                quantity: 1,
                size: selectedSize,
                colorId: selectedColorId,
              })
            );
          }}
        >
          Sepete Ekle
        </LoadingButton>

        {item && (
          <Typography sx={{ mt: 1 }}>
            Sepette {item.quantity} adet var
          </Typography>
        )}

        {/* YORUMLAR */}
        <Box mt={5}>
          <Typography variant="h6">Yorumlar</Typography>

          {comments.map((c) => (
            <Paper key={c.id} sx={{ p: 1.5, mb: 1 }}>
              <Typography fontWeight="bold">{c.username}</Typography>
              <Typography>{c.text}</Typography>
            </Paper>
          ))}

          {user && (
            <>
              <TextField
                fullWidth
                multiline
                minRows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <LoadingButton sx={{ mt: 1 }} onClick={handleAddComment}>
                Gönder
              </LoadingButton>
            </>
          )}
        </Box>
 
<Box sx={{ width: "100%", mt: 10 }}>
  <Typography
    variant="h5"
    sx={{
      mb: 3,
      ml:"-532px",
      fontWeight: 600,
      borderBottom: "1px solid #eee",
      pb: 1,
      pl: 1,
    }}
  >
    Benzer Ürünler
  </Typography>

  {loadingSimilar && <CircularProgress />}

  <Box
    sx={{
      display: "flex",
      gap: 3,
      overflowX: "auto",
      pb: 2,

      "&::-webkit-scrollbar": { display: "none" },
      scrollbarWidth: "none",
    }}
  >
    {similarProducts.map((p) => (
      <Paper
        key={p.id}
        sx={{
          width: 220,
          p: 1.5,
          flexShrink: 0,
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
        }}
        onClick={() => (window.location.href = `/catalog/${p.id}`)}
      >
        <Box
          component="img"
          src={`http://localhost:5198/${p.imageUrl}`}
          sx={{
            width: "100%",
            height: 160,
            objectFit: "cover",
            borderRadius: 1,
            mb: 1,
          }}
        />

        <Typography fontWeight={600} noWrap>
          {p.name}
        </Typography>

        <Typography color="text.secondary" fontSize="0.9rem">
          {currenyTRY.format(p.price)}
        </Typography>
      </Paper>
    ))}
  </Box>
</Box>
    </Stack>
  );
}
