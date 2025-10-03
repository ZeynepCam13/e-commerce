import { Box, Container, Stack, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",   // Header ile aynı renk
        color: "white",
        py: 3,
        mt: 4,
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          {/* Sol kısım */}
          <Box>
            <Typography variant="h6" gutterBottom>
              E-Commerce
            </Typography>
            <Typography variant="body2">
              © 2025 E-Ticaret. Tüm hakları saklıdır.
            </Typography>
          </Box>

          {/* Sağ kısım */}
          <Stack direction="row" spacing={2}>
            <Link href="/" color="inherit" underline="hover">
              Home
            </Link>
            <Link href="/catalog" color="inherit" underline="hover">
              Catalog
            </Link>
            <Link href="/about" color="inherit" underline="hover">
              About
            </Link>
            <Link href="/contact" color="inherit" underline="hover">
              Contact
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
