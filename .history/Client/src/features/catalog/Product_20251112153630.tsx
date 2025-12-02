import { useState } from "react";
import { AddShoppingCart } from "@mui/icons-material";
import { IProduct } from "../../model/IProduct";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router";
import { LoadingButton } from "@mui/lab";
import { currenyTRY } from "../../utils/formatCurrency";
import { addItemToCart } from "../cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { addFavorite, removeFavorite } from "../favorites/FavoritesSlice";
import { toast } from "react-toastify";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

interface Props {
  product: IProduct;
}

export default function Product({ product }: Props) {
  const { status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.favorites);
  const isFavorite = favorites.some((f) => f.id === product.id);
  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(product.id));
      toast.info("Ürün favorilerden kaldırıldı ");
    } else {
      dispatch(addFavorite(product.id));
      toast.success("Ürün favorilere eklendi ");
    }
  };

  // ✅ Çoklu resim için state
  const [currentIndex, setCurrentIndex] = useState(0);

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => `http://localhost:5198/${img.imageUrl}`)
      : [`http://localhost:5198/${product.imageUrl}`];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card
      sx={{
        maxWidth: 270,
        height: 370,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: 2,
        overflow: "hidden",
        position: "relative",
        borderRadius: 4,
        p: 2,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "scale(1.04)",
          boxShadow: 5,
        },
      }}
    >
      {/* 📸 Görsel alanı */}
      <Box sx={{ position: "relative", width: "100%" }}>
        <CardMedia
          component="img"
          sx={{
            height: 210,
            width: "100%",
            objectFit: "contain",
            borderRadius: 2,
            transition: "0.4s ease",
          }}
          image={images[currentIndex]}
        />

        {/* 🔁 Çoklu foto varsa oklar */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                top: "50%",
                left: 5,
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.7)",
                "&:hover": { backgroundColor: "white" },
              }}
            >
              <ArrowBackIos fontSize="small" />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: 5,
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.7)",
                "&:hover": { backgroundColor: "white" },
              }}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </>
        )}

        {/* 🔻 İndirim etiketi */}
        {product.discount && product.discount > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: -30,
              background: "linear-gradient(90deg, #dd2d24ff, #9f0b0b3b)",
              color: "white",
              px: 1.2,
              py: 1,
              transform: "rotate(-45deg)",
              fontWeight: "bold",
              textAlign: "center",
              width: "110px",
              zIndex: 3,
              fontSize: "0.7rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            İNDİRİMLİ ÜRÜN
          </Box>
        )}

        {/* ❤️ Favori butonu */}
        <IconButton
          onClick={handleFavorite}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 36,
            height: 36,
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: 1,
            zIndex: 5,
            "&:hover": {
              backgroundColor: "#f5f5f5",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {/* 🛍️ Ürün bilgisi */}
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2" color="text.secondary">
          {product.name}
        </Typography>

        {product.discount && product.discount > 0 ? (
          <Typography variant="body1" color="text.secondary">
            <span
              style={{
                textDecoration: "line-through",
                color: "gray",
                marginRight: 8,
              }}
            >
              {currenyTRY.format(product.originalPrice ?? product.price)}
            </span>
            <span style={{ color: "red", fontWeight: "bold" }}>
              {currenyTRY.format(product.price)}
            </span>
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            {currenyTRY.format(product.price)}
          </Typography>
        )}
      </CardContent>

      {/* 🎯 Butonlar */}
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0.5,
          width: "100%",
          mt: "auto",
          pb: 1,
        }}
      >
        <LoadingButton
          size="small"
          variant="contained"
          startIcon={<AddShoppingCart sx={{ fontSize: 18 }} />}
          loading={status === "pendingAddItem" + product.id}
          onClick={() => dispatch(addItemToCart({ productId: product.id }))}
          sx={{
            flex: 1,
            minWidth: 110,
            maxWidth: 120,
            height: 36,
            textTransform: "none",
            fontSize: "0.8rem",
            fontWeight: 500,
            borderRadius: 2,
            backgroundColor: "white",
            color: "black",
            border: "1px solid #212121",
            "&:hover": {
              backgroundColor: "#1e1d1dff",
              color: "white",
            },
          }}
        >
          Sepete Ekle
        </LoadingButton>

        <Button
          component={Link}
          to={`/catalog/${product.id}`}
          variant="outlined"
          size="small"
          startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
          color="primary"
          sx={{
            flex: 1,
            minWidth: 110,
            maxWidth: 120,
            height: 36,
            textTransform: "none",
            fontSize: "0.8rem",
            fontWeight: 500,
            borderRadius: 2,
            borderColor: "#212121",
            color: "#212121",
            "&:hover": {
              borderColor: "#424242",
              backgroundColor: "#181818ff",
              color: "white",
            },
          }}
        >
          Görüntüle
        </Button>
      </CardActions>
    </Card>
  );
}
