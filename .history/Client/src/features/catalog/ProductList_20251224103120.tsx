import { Grid, Box } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import Product from "./Product";

interface Props {
  products: IProduct[];
}

export default function ProductList({ products }: Props) {
  return (
    <Box sx={{ flexGrow: 1, py: 4 }}>
      <Grid container spacing={3}>
        {products.map((p: IProduct) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <Box display="flex" justifyContent="center">
              <Product product={p} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}