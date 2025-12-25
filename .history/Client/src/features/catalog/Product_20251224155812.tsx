import { AddShoppingCart, Favorite, FavoriteBorder, Visibility } from "@mui/icons-material";
import { IProduct } from "../../model/IProduct";
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Chip } from "@mui/material";
import { Link } from "react-router";
import { LoadingButton } from "@mui/lab";
import { currenyTRY } from "../../utils/formatCurrency";
import { addItemToCart } from "../cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addFavorite, removeFavorite } from "../favorites/FavoritesSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import SelectSizeModal from "./SelectSizeModal";

interface Props {
  product: IProduct;
}

export default function Product({ product }: Props) {
  const { status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.favorites);
  const isFavorite = favorites.some((f) => f.id === product.id);
  const [openSizeModal, setOpenSizeModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = product.images && product.images.length > 0
    ? `http://localhost:5198/${product.images[0].imageUrl}`
    : "/placeholder.png";

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite) {
      dispatch(removeFavorite(product.id));
      toast.info("Favorilerden kaldırıldı");
    } else {
      dispatch(addFavorite(product.id));
      toast.success("Favorilere eklendi");
    }
  };

  return (
    <>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: "100%",
          
          borderRadius: 0, // Keskin köşeler daha modern durur (Zara style)
          boxShadow: "none",
          border: "1px solid #eee",
          position: "relative",
          flexDirection: "column",
          height: "100%",
          transition: "0.3s",
          "&:hover": { boxShadow: "0 10px 20px rgba(0,0,0,0.08)" },
        }}
      >
        {/* Favori Butonu */}
        <IconButton
          onClick={handleFavorite}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": { bgcolor: "white" },
          }}
        >
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>

        {/* İndirim Etiketi */}
        {product.discount && product.discount > 0 && (
          <Chip
            label="İNDİRİM"
            size="small"
            color="error"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 10,
              borderRadius: 0,
              fontWeight: "bold",
              fontSize: "0.65rem"
            }}
          />
        )}

        {/* Görsel ve Hover Butonları */}
        <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: "1/1.2" }}>
          <CardMedia
            component="img"
            image={imageUrl}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: isHovered ? "scale(1.08)" : "scale(1)",
            }}
          />
          
          {/* Hızlı Aksiyon Butonları (Sadece Hover'da) */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 1.5,
              background: "linear-gradient(transparent, rgba(0,0,0,0.4))",
              transform: isHovered ? "translateY(0)" : "translateY(100%)",
              transition: "0.3s ease-in-out",
              display: "flex",
              gap: 1
            }}
          >
            <LoadingButton
              fullWidth
              variant="contained"
              size="small"
              onClick={() => setOpenSizeModal(true)}
              loading={status === "pendingAddItem" + product.id}
              sx={{ bgcolor: "white", color: "black", "&:hover": { bgcolor: "#f0f0f0" }, borderRadius: 0 }}
            >
              Sepete Ekle
            </LoadingButton>
            <IconButton 
              component={Link} 
              to={`/catalog/${product.id}`}
              sx={{ bgcolor: "white", color: "black", "&:hover": { bgcolor: "#f0f0f0" }, borderRadius: 0 }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ textAlign: "center", pt: 2, pb: "16px !important" }}>
          <Typography 
            variant="body2" 
            sx={{ 
              textTransform: "uppercase", 
              letterSpacing: 1, 
              color: "text.secondary",
              mb: 0.5,
              fontSize: "0.75rem",
              fontWeight: 600
            }}
          >
            {product.marka || "KOLEKSİYON"}
          </Typography>
          <Typography 
            variant="body1" 
            noWrap 
            sx={{ fontWeight: 400, mb: 1 }}
          >
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            {product.discount ? (
              <>
                <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                  {currenyTRY.format(product.originalPrice ?? product.price)}
                </Typography>
                <Typography variant="body1" sx={{ color: "error.main", fontWeight: "bold" }}>
                  {currenyTRY.format(product.price)}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {currenyTRY.format(product.price)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <SelectSizeModal
        open={openSizeModal}
        onClose={() => setOpenSizeModal(false)}
        product={product}
        onConfirm={(selectedSize) => {
          dispatch(addItemToCart({ productId: product.id, quantity: 1, size: selectedSize }));
          setOpenSizeModal(false);
        }}
      />
    </>
  );
}