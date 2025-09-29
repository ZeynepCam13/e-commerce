import { Box } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import Product from "./Product";

interface Props {
  products: IProduct[];
}

export default function ProductList({ products }: Props) {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
      gap={2}
    >
      {products.map((p: IProduct) => (
        <Product key={p.id} product={p} />
      ))}
    </Box>
  );
}

