import { Box, Paper, Stack } from "@mui/material";
import Info from "./Info";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";

export default function CheckoutPage() {
  return (
    <Paper sx={{ p: 4 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        {/* Sol kısım */}
        <Box flex={{ md: 1 }}>
          <Info />
        </Box>

        {/* Sağ kısım */}
        <Box flex={{ md: 2 }}>
          <Stack spacing={2}>
            <AddressForm />
            <PaymentForm />
            <Review />
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
