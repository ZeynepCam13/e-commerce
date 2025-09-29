import {
  CircularProgress, Divider, Stack, Table, TableBody,
  TableCell, TableContainer, TableRow, Typography, Box
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";
import NotFound from "../../errors/ServerError";
import LoadingButton from "@mui/lab/LoadingButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCartContext } from "../../../context/CartContext";
import { toast } from "react-toastify";
import { currenyTRY } from "../../utils/formatCurrency";

export default function ProductDetailsPage() {
  const { cart, setCart } = useCartContext();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  const item = cart?.cartItems.find(i => i.productId === product?.id);

  useEffect(() => {
    if (!id) return;
    requests.Catalog.details(Number(id))
      .then(data=>setProduct(data))
      .catch(error=>console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddItem(id: number) {
    setIsAdded(true);
    requests.Cart.addItem(id)
      .then((cart) => {setCart(cart);
        toast.success("Sepetinize eklendi.");
      })
      .catch(error =>console.log(error))
      .finally(() => setIsAdded(false));
  }

  if (loading) return <CircularProgress />;
  if (!product) return <NotFound />;

  return (
    <Stack
  spacing={4}
  direction={{ xs: "column", md: "row" }}
  sx={{ mt: 3, alignItems: { xs: "center", md: "flex-start" } }}
>
  {/* Sol: Resim */}
  <Box
    sx={{
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <Box
      component="img"
      src={`http://localhost:5198/${product.imageUrl}`}
      alt={product.name}
      sx={{
        width: { xs: "80%", sm: "300px", md: "400px" }, // responsive genişlik
        height: "auto",
        objectFit: "contain",
        display: "block",
        margin: "0 auto"
      }}
    />
  </Box>

      {/* Sağ: Bilgiler */}
      <Box sx={{ flex: 2 }}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2, mt: 1 }} />
        <Typography variant="h4" color="secondary">
          {currenyTRY.format(product.price) } 
        </Typography>

        <TableContainer sx={{ mt: 2 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Adı</TableCell>
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
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="center">
          <LoadingButton
            variant="outlined"
            loadingPosition="start"
            startIcon={<AddShoppingCartIcon />}
            loading={isAdded}
            onClick={() => handleAddItem(product.id)}
          >
            Sepete Ekle
          </LoadingButton>

          {item && item.quantity > 0 && (
            <Typography variant="body2">
              Sepetinize {item.quantity} adet eklendi
            </Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

