import { Box, Typography, Stack, Link } from "@mui/material";

export default function AboutPage() {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        <strong> İstek Şikayet ve öneri için lütfen bize ulaşınız.</strong>
      </Typography>

      <Typography variant="body1" sx={{ mt:1, maxWidth: 700, mx: "auto" }}>
        
      </Typography>

      <Stack spacing={1.2} sx={{ mt: 5 }}>
        <Typography variant="h6">İletişim</Typography>
        <Typography>📞 Telefon: +90 533 333 33 33</Typography>
        <Typography>
          📧 E-posta:{" "}
          <Link href="mailto:zeynep@example.com" underline="hover">
            zeynepticaret@gmail.com
          </Link>
        </Typography>
        <Typography>📍 Konum: İstanbul / Türkiye</Typography>
      </Stack>
    </Box>
  );
}
