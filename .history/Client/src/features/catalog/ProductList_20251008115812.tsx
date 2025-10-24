import { Box, Stack } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import Product from "./Product";

interface Props {
  products: IProduct[];
}

export default function ProductList({ products }: Props) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={2}>
      {products.map((p: IProduct) => (
        <Box key={p.id} flexBasis={{ xs: "100%", md: "30%",sm:"45%", lg: "28%" }}>
          <Product product={p} />
        </Box>
      ))}
    </Stack>
  );
}
