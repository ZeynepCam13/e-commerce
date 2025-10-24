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


interface Props {
    product: IProduct
}



export default function Product({product}: Props) {

  const { status } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();

   const { favorites } = useAppSelector(state => state.favorites);
  const isFavorite = favorites.some(f => f.id === product.id);

   const handleFavorite = () => {
    if (isFavorite) dispatch(removeFavorite(product.id));
    else dispatch(addFavorite(product.id));
  };

    return (
     <Card >
      <CardMedia sx={{ height: 160, backgroundSize: "contain"}} image={`http://localhost:5198/${product.imageUrl}`} />
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
        <IconButton component={Link} to={`favorites/FavoritesPage/${product.id}`} onClick={handleFavorite}>
      {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
    </IconButton>
      </CardActions>
     </Card>
    );
  }
  