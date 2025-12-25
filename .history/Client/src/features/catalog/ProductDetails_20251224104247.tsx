import {
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import NotFound from "../../errors/NotFound";
import { LoadingButton } from "@mui/lab";
import { AddShoppingCart, FavoriteBorder, Star } from "@mui/icons-material";
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const product = useAppSelector((state) => selectProductById(state, Number(id)));
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
  const zoomLevel = 2.5;

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

  useEffect(() => {
    if (product?.productColors?.length) {
      const firstInStock = product.productColors.find((c) => c.stock > 0) || product.productColors[0];
      setSelectedColorId(firstInStock?.id ?? null);
    }
  }, [product]);

  const selectedColor = product?.productColors?.find((c) => c.id === selectedColorId);

  const handleAddComment = async () => {
    if (!commentText.trim() || !product) return;
    await dispatch(addComment({ productId: product.id, text: commentText }));
    setCommentText("");
  };

  if (loading === "pendingFetchProductById") return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!product) return <NotFound />;

  const galleryImages = product.images?.length
    ? product.images.map((img) => `http://localhost:5198/${img.imageUrl}`)
    : [`http://localhost:5198/${product.imageUrl}`];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Grid container spacing={6}>
        {/* SOL - Görsel Alanı */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "sticky", top: 100 }}>
            <ProductImageSlider
              images={galleryImages}
              onZoomImageChange={(img, pos) => {
                setZoomImg(img);
                setZoomPos(pos);
              }}
            />
          </Box>
        </Grid>

        {/* SAĞ - Detay Alanı */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
              {product.marka}
            </Typography>
            <Typography variant="h4" component="h1" fontWeight="700" gutterBottom>
              {product.name}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#faaf00' }}>
                <Star fontSize="small" /> <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold', color: 'text.primary' }}>4.8</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">({comments.length} Değerlendirme)</Typography>
            </Stack>

            <Box sx={{ mb: 4, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              {product.discount ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                   <Typography variant="h4" color="error.main" fontWeight="800">
                    {currenyTRY.format(product.price)} ₺
                  </Typography>
                  <Typography sx={{ textDecoration: "line-through", color: "text.secondary", fontSize: "1.1rem" }}>
                    {currenyTRY.format(product.originalPrice || 0)} ₺
                  </Typography>
                  <Chip label={`%${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)} İndirim`} color="error" size="small" />
                </Stack>
              ) : (
                <Typography variant="h4" fontWeight="800">
                  {currenyTRY.format(product.price)} ₺
                </Typography>
              )}
            </Box>

            {/* Renk Seçimi */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Renk: <Box component="span" fontWeight="400" color="text.secondary">{selectedColor?.colorName || "Seçiniz"}</Box>
              </Typography>
              <Stack direction="row" spacing={2}>
                {product.productColors?.map((color) => (
                  <Box
                    key={color.id}
                    onClick={() => color.stock > 0 && setSelectedColorId(color.id)}
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      backgroundColor: color.colorCode,
                      cursor: color.stock > 0 ? "pointer" : "not-allowed",
                      position: 'relative',
                      border: "1px solid #e0e0e0",
                      outline: selectedColorId === color.id ? "2px solid #000" : "none",
                      outlineOffset: "3px",
                      transition: "0.2s",
                      "&:hover": { transform: color.stock > 0 ? "scale(1.1)" : "none" },
                      opacity: color.stock === 0 ? 0.3 : 1,
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Beden Seçimi */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Beden Seçin</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {product.productSizes?.map((ps) => (
                  <Button
                    key={ps.id}
                    variant="outlined"
                    disabled={ps.stock === 0}
                    onClick={() => setSelectedSize(ps.size)}
                    sx={{
                      minWidth: 60,
                      height: 45,
                      borderRadius: 1,
                      borderColor: selectedSize === ps.size ? "black" : "#e0e0e0",
                      color: selectedSize === ps.size ? "white" : "text.primary",
                      bgcolor: selectedSize === ps.size ? "black" : "transparent",
                      "&:hover": { bgcolor: selectedSize === ps.size ? "black" : "#f5f5f5", borderColor: "black" }
                    }}
                  >
                    {ps.size.toUpperCase()}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Aksiyon Butonları */}
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                startIcon={<AddShoppingCart />}
                loading={status === "pendingAddItem"}
                onClick={() => {
                  if (!selectedColorId || !selectedSize) {
                    alert("Lütfen seçim yapın"); return;
                  }
                  dispatch(addItemToCart({ productId: product.id, quantity: 1, size: selectedSize, colorId: selectedColorId }));
                }}
                sx={{ bgcolor: "black", py: 1.5, "&:hover": { bgcolor: "#333" } }}
              >
                SEPETE EKLE
              </LoadingButton>
              <IconButton sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
                <FavoriteBorder />
              </IconButton>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Ürün Açıklaması</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {product.description}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* BENZER ÜRÜNLER SEKSİYONU */}
      <Box sx={{ mt: 10 }}>
        <Typography variant="h5" fontWeight="700" mb={4}>Benzer Ürünler</Typography>
        <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 3 } }}>
          {similarProducts.map((p) => (
            <Paper
              key={p.id}
              elevation={0}
              onClick={() => navigate(`/catalog/${p.id}`)}
              sx={{
                minWidth: 240,
                cursor: "pointer",
                border: "1px solid #f0f0f0",
                transition: "0.3s",
                "&:hover": { boxShadow: "0 10px 20px rgba(0,0,0,0.05)", transform: "translateY(-5px)" }
              }}
            >
              <Box component="img" src={`http://localhost:5198/${p.imageUrl}`} sx={{ width: "100%", height: 300, objectFit: "cover" }} />
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">{p.marka}</Typography>
                <Typography fontWeight="600" noWrap>{p.name}</Typography>
                <Typography fontWeight="700" mt={1}>{currenyTRY.format(p.price)} ₺</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

     {/* YORUMLAR */}
      <Box mt={5}>
         <Typography variant="h6">
          Yorumlar
          </Typography>
           {comments.map((c) => ( <Paper key={c.id} sx={{ p: 1.5, mb: 1 }}> 
            <Typography fontWeight="bold">{c.username}</Typography>
             <Typography>{c.text}</Typography> </Paper> ))} {user && ( <> 
             <TextField fullWidth multiline minRows={2}
              value={commentText} onChange={(e) => setCommentText(e.target.value)} /> 
              <LoadingButton sx={{ mt: 1 }} onClick={handleAddComment}> Gönder </LoadingButton> </> )} </Box>

      {/* ZOOM MODAL (Opsiyonel Geliştirme) */}
      {zoomImg && (
        <Box
          sx={{
            position: "fixed",
            left: "55%",
            top: "15%",
            width: 500,
            height: 600,
            overflow: "hidden",
            borderRadius: 2,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            background: "#fff",
            zIndex: 1000,
            pointerEvents: 'none',
            display: { xs: "none", lg: "block" },
          }}
        >
          <img
            src={zoomImg}
            alt="Zoom"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoomLevel}) translate(
                ${-(zoomPos.x / 500) * 80}%,
                ${-(zoomPos.y / 500) * 80}%
              )`,
              transformOrigin: "top left",
            }}
          />
        </Box>
      )}
    </Box>
  );
}