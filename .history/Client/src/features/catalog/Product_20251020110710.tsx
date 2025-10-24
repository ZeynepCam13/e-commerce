import { AddShoppingCart } from "@mui/icons-material";
import { IProduct } from "../../model/IProduct";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router";
import { LoadingButton } from "@mui/lab";
import { currenyTRY } from "../../utils/formatCurrency";
import { addItemToCart } from "../cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { addFavorite, removeFavorite } from "../favorites/FavoritesSlice";
import { toast } from "react-toastify";


interface Props {
    product: IProduct
}



export default function Product({product}: Props) {

  const { status } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();

  const { favorites } = useAppSelector(state => state.favorites);
  const isFavorite = favorites.some(f => f.id === product.id);

  const handleFavorite = () => {
    if (isFavorite){ dispatch(removeFavorite(product.id));
     toast.info("Ürün favorilerden kaldırıldı ")}
       
    else{ dispatch(addFavorite(product.id));
      toast.success("Ürün favorilere eklendi ");}
    
  };

    return (
     <Card
        sx={{maxWidth: 240, // 🔹 Kart genişliği
        height: 360, // 🔹 Kart yüksekliği
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: 2,
        borderRadius: 3,
        p: 1,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "scale(1.04)", // 🔹 Hover efekti
          boxShadow: 5,
        },
      }} >
      <CardMedia
         component="image"
      
         sx={{
          height: 180,
          width: "100%",
          objectFit: "contain",
          
          borderRadius: 2,
        }} image={`http://localhost:5198/${product.imageUrl}`} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2" color="text.secondary">
          {product.name}
        </Typography>
        <Typography variant="body2" color="secondary">
          { currenyTRY.format(product.price) }
        </Typography>
      </CardContent>
      <CardActions >
        <LoadingButton  
          size="small"
          variant="outlined"
          loadingPosition="start"
          startIcon={<AddShoppingCart/>} 
          loading={ status === "pendingAddItem" + product.id } 
          onClick={() => dispatch(addItemToCart({productId: product.id}))}>Sepete Ekle</LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} variant="outlined" size="small" startIcon={<SearchIcon />} color="primary">Görüntüle</Button>
        <IconButton onClick={handleFavorite}>
      {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
    </IconButton>
      </CardActions>
     </Card>
    );
  }
  