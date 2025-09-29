import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { IProduct } from "../../model/IProduct";
import { AddShoppingCart, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import requests from "../../api/requests";
import { useCartContext } from "../../../context/CartContext";
import { currenyTRY } from "../../utils/formatCurrency";

interface Props {
  product: IProduct;
}

export default function Product({ product }: Props) {

const[loading,setLoading]=useState(false)

const{setCart}=useCartContext();

function handleAddItem(productId:number)
{

  setLoading(true);
  
  requests.Cart.addItem(productId)
  .then(cart => setCart(cart))
  .catch(error=>console.log(error))
  .finally(()=>setLoading(false));


}

  return (
    <Card sx={{display:"flex", flexDirection:"column",height:"100%"}}>
      <CardMedia
        sx={{ height: 160, backgroundSize: "contain" }}
        image={`http://localhost:5198/${product.imageUrl}`} 
      />
      <CardContent sx={{flexGrow:1}}>
        <Typography gutterBottom variant="h6">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currenyTRY.format(product.price)}
        </Typography>
      </CardContent>
      <CardActions>
        {/*<Button ll"sx={{ backgroundColor: "#f03737ff" }} size="sma variant="contained" color="primary" onClick={()=>handleAddItem(product.id)} startIcon={<AddShoppingCart/>}>
        Sepete Ekle
        </Button>*/}

        <LoadingButton 
        sx ={{backgroundColor:"#f6f3f3ff"}} size="small" variant="outlined" startIcon={<AddShoppingCart/>}
        loading={loading}
        onClick={()=> 
        handleAddItem(product.id)}> Sepete Ekle</LoadingButton>
        <Button sx={{ borderColor:"#0000", backgroundColor: "#d8d5d5ff", color: "#f03737ff"}}  component={Link} to={`/catalog/${product.id}`} size="small"  variant="outlined"  startIcon={<Visibility/>}>
        Görüntüle
        </Button>
      </CardActions>
    </Card>
  );
}
