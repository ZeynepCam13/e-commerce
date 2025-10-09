import { AddShoppingCart, Search as SearchIcon } from "@mui/icons-material";
import { IProduct } from "../../model/IProduct";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import { LoadingButton } from "@mui/lab";
import { currenyTRY } from "../../utils/formatCurrency";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addItemToCart } from "../cart/cartSlice";

interface Props {
  product: IProduct;
}

export default function Product({ product }: Props) {
  const { status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Ürün resmi */}
      <CardMedia
        sx={{ height: 160, backgroundSize: "contain" }}
        image={`http://localhost:5198/${product.imageUrl}`}
        title={product.name}
      />

      {/* Ürün içeriği */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          color="text.secondary"
          noWrap
        >
          {product.name}
        </Typography>
        <Typography variant="body2" color="secondary">
          {currenyTRY.format(product.price)}
        </Typography>
      </CardContent>

      {/* Butonlar → her zaman en alta */}
      <CardActions sx={{ mt: "auto", justifyContent: "space-between" }}>
        <LoadingButton
          size="small"
          variant="outlined"
          loadingPosition="start"
          startIcon={<AddShoppingCart />}
          loading={status === "pendingAddItem" + product.id}
          onClick={() => dispatch(addItemToCart({ productId: product.id }))}
        >
          Sepete Ekle
        </LoadingButton>

        <Button
          component={Link}
          to={`/catalog/${product.id}`}
          variant="outlined"
          size="small"
          startIcon={<SearchIcon />}
          color="primary"
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
}
