import { Box, Typography, Stack, Divider, Paper } from "@mui/material";
import { currenyTRY } from "../../utils/formatCurrency";
import { useAppSelector } from "../../store/store";

export default function CartSummary() {
  const { cart } = useAppSelector((state) => state.cart);

  const originalSubTotal =
    cart?.cartItems.reduce(
      (sum, item) =>
        sum + item.quantity * Number((item.originalPrice ?? item.price)),
      0
    ) ?? 0;

  const discountedSubTotal =
    cart?.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) ?? 0;

  const discountAmount = originalSubTotal - discountedSubTotal;
  const tax = discountedSubTotal * 0.2;
  const total = discountedSubTotal + tax;

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 3, 
        bgcolor: '#fafafa', 
        borderRadius: 3, 
        border: '1px solid #eee' 
      }}
    >
      <Typography variant="h6" fontWeight="800" mb={3} sx={{ letterSpacing: -0.5 }}>
        Sipariş Özeti
      </Typography>

      <Stack spacing={2}>
        {/* ARA TOPLAM */}
        <Box display="flex" justifyContent="space-between">
          <Typography color="text.secondary" variant="body2">Ara Toplam</Typography>
          <Typography variant="body2" fontWeight="600">
            {currenyTRY.format(discountedSubTotal)}
          </Typography>
        </Box>

        {/* İNDİRİM (Varsa Göster) */}
        {discountAmount > 0 && (
          <Box display="flex" justifyContent="space-between">
            <Typography color="success.main" variant="body2" fontWeight="600">Uygulanan İndirim</Typography>
            <Typography color="success.main" variant="body2" fontWeight="600">
              -{currenyTRY.format(discountAmount)}
            </Typography>
          </Box>
        )}

        {/* VERGİ */}
        <Box display="flex" justifyContent="space-between">
          <Typography color="text.secondary" variant="body2">Vergi (%20)</Typography>
          <Typography variant="body2" fontWeight="600">
            {currenyTRY.format(tax)}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* GENEL TOPLAM */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="800">Genel Toplam</Typography>
          <Typography variant="h6" fontWeight="800" color="primary.main">
            {currenyTRY.format(total)}
          </Typography>
        </Box>
      </Stack>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
        Kargo ücreti ödeme adımında hesaplanacaktır.
      </Typography>
    </Paper>
  );
}