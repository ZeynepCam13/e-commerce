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
import { AddShoppingCart, FavoriteBorder, Star, WarningAmber } from "@mui/icons-material";
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

  const product = useAppSelector((state) => selectProductById(state, Number(id)));
  const { status: loading } = useAppSelector((state) => state.catalog);
  const { comments } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.account);

  const [commentText, setCommentText] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const zoomLevel = 2.5;

  // --- Stok Mantığı Hesaplamaları ---
  const selectedSizeData = product?.productSizes?.find((ps) => ps.size === selectedSize);
  const currentStock = selectedSizeData ? selectedSizeData.stock : null;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock !== null && currentStock > 0 && currentStock <= 10;

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
    if (!commentText.trim() || !product || !user) return;
    await dispatch(addComment({ productId: product.id, text: commentText }));
    setCommentText("");
    dispatch(fetchComments(product.id));
  };

  if (loading === "pendingFetchProductById") return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!product) return <NotFound />;

  const galleryImages = product.images?.length
    ? product.images.map((img) => `http://localhost:5198/${img.imageUrl}`)
    : [`http://localhost:5198/${product.imageUrl}`];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Grid container spacing={6}>
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
                <Star fontSize="small" /> 
                <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold', color: 'text.primary' }}>4.8</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">({comments.length} Değerlendirme)</Typography>
            </Stack>

            <Box sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
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

            {/* STOK UYARI ALANI */}
            <Box sx={{ mb: 3, minHeight: '24px' }}>
              {selectedSize && isOutOfStock && (
                <Typography color="error" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningAmber fontSize="small" /> Bu beden tükendi!
                </Typography>
              )}
              {selectedSize && isLowStock && (
                <Typography color="warning.dark" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningAmber fontSize="small" /> Acele et! Son {currentStock} ürün kaldı.
                </Typography>
              )}
            </Box>

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
                      position: 'relative',
                      borderColor: selectedSize === ps.size ? "black" : "#e0e0e0",
                      color: ps.stock === 0 ? "text.disabled" : (selectedSize === ps.size ? "white" : "text.primary"),
                      bgcolor: selectedSize === ps.size ? "black" : "transparent",
                      "&:hover": { bgcolor: selectedSize === ps.size ? "black" : "#f5f5f5", borderColor: "black" },
                      // Stokta yoksa üzerine çizgi çekme efekti
                      "&::after": ps.stock === 0 ? {
                        content: '""',
                        position: 'absolute',
                        width: '70%',
                        height: '1px',
                        bgcolor: 'text.disabled',
                        transform: 'rotate(-45deg)'
                      } : {}
                    }}
                  >
                    {ps.size.toUpperCase()}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                startIcon={!isOutOfStock && <AddShoppingCart />}
                loading={status === "pendingAddItem"}
                disabled={isOutOfStock || !selectedColorId || !selectedSize}
                onClick={() => {
                  if (!selectedColorId || !selectedSize) return;
                  dispatch(addItemToCart({ productId: product.id, quantity: 1, size: selectedSize, colorId: selectedColorId }));
                }}
                sx={{ 
                    bgcolor: isOutOfStock ? "grey.400" : "black", 
                    py: 1.5, 
                    "&:hover": { bgcolor: isOutOfStock ? "grey.400" : "#333" } 
                }}
              >
                {isOutOfStock ? "TÜKENDİ" : "SEPETE EKLE"}
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

      {/* Yorumlar ve Sizin İçin Seçtiklerimiz bölümleri (Aynı Kalıyor) */}
      <Box mt={8} sx={{ maxWidth: 800 }}>
        <Typography variant="h5" fontWeight="700" mb={4}>
          Müşteri Yorumları ({comments.length})
        </Typography>
        <Stack spacing={3} mb={5}>
          {comments.map((c) => (
            <Paper 
              key={c.id} 
              elevation={0} 
              sx={{ p: 2.5, bgcolor: "#f9f9f9", borderRadius: 2, border: "1px solid #eee" }}
            >
              <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                <Box sx={{ 
                  width: 40, height: 40, bgcolor: "black", color: "white", 
                  borderRadius: "50%", display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', fontWeight: 'bold', fontSize: "0.9rem"
                }}>
                  {c.username ? c.username[0].toUpperCase() : 'U'}
                </Box>
                <Box>
                  <Typography fontWeight="700" sx={{ lineHeight: 1.2 }}>{c.username}</Typography>
                  <Typography variant="caption" color="text.secondary">Müşteri Değerlendirmesi</Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.6 }}>{c.text}</Typography>
            </Paper>
          ))}
        </Stack>
        {/* Yorum Yapma Alanı */}
        {user ? (
          <Box sx={{ p: 3, bgcolor: "white", borderRadius: 2, border: "1px solid #000" }}>
            <Typography fontWeight="700" mb={2}>Ürünü değerlendirin</Typography>
            <TextField
              fullWidth multiline minRows={3}
              placeholder="Deneyiminizi buraya yazın..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <LoadingButton 
              variant="contained" onClick={handleAddComment}
              disabled={!commentText.trim()}
              sx={{ bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" }, px: 4 }}
            >
              Yorumu Gönder
            </LoadingButton>
          </Box>
        ) : (
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#fffbe6", border: "1px solid #ffe58f" }}>
            <Typography variant="body1">
              Yorum yapabilmek için lütfen <strong>üye olun</strong> veya <strong>giriş yapın</strong>.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Benzer Ürünler */}
      <Box sx={{ width: "100%", mt: 10 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, pb: 1 }}>Sizin İçin Seçtiklerimiz</Typography>
        {loadingSimilar && <CircularProgress size={24} sx={{ mb: 2 }} />}
        <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 3, "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}>
          {similarProducts.map((p) => (
            <Paper
              key={p.id} elevation={0}
              sx={{ width: 220, p: 0, flexShrink: 0, cursor: "pointer", border: "1px solid #eee", transition: "0.3s", overflow: "hidden", "&:hover": { boxShadow: "0 10px 20px rgba(0,0,0,0.05)", transform: "translateY(-4px)" } }}
              onClick={() => (window.location.href = `/catalog/${p.id}`)}
            >
              <Box component="img" src={`http://localhost:5198/${p.imageUrl}`} sx={{ width: "100%", height: 280, objectFit: "cover" }} />
              <Box p={1.5}>
                <Typography fontWeight={600} noWrap fontSize="0.9rem">{p.name}</Typography>
                <Typography color="text.secondary" fontWeight={700} mt={0.5}>{currenyTRY.format(p.price)}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Zoom Katmanı */}
      {zoomImg && (
        <Box
          sx={{
            position: "fixed", left: "55%", top: "15%", width: 500, height: 600,
            overflow: "hidden", borderRadius: 2, boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            background: "#fff", zIndex: 1000, pointerEvents: 'none', display: { xs: "none", lg: "block" },
          }}
        >
          <img
            src={zoomImg} alt="Zoom"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${zoomLevel}) translate(${-(zoomPos.x / 500) * 80}%, ${-(zoomPos.y / 500) * 80}%)`,
              transformOrigin: "top left",
            }}
          />
        </Box>
      )}
    </Box>
  );
}