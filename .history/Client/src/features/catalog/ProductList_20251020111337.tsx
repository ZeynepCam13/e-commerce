import { Box, Stack } from "@mui/material";
import { IProduct } from "../../model/IProduct";
import Product from "./Product";

interface Props {
  products: IProduct[];
}

export default function ProductList({ products }: Props) {
  return (
    <Stack direction="row" flexWrap="wrap" justifyContent="flex-start" gap={1.5}>
      {products.map((p: IProduct) => (
        <Box
          key={p.id}
          flexBasis={{ xs: "100%", sm: "48%", md: "31%", lg: "23%" }}
          display="flex"
          justifyContent="center"
        >
          <Product product={p} />
        </Box>
      ))}
    </Stack>
  );
}
