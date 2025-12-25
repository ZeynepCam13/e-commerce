import { Grid, Container } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import Product from "./Product";

interface Props {
  products: IProduct[];
}

export default function ProductList({ products }: Props) {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}> {/* spacing={2} boşlukları daraltır, modern bir görünüm sağlar */}
        {products.map((p: IProduct) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <Product product={p} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}