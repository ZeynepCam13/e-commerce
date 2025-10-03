import { Box, Container, Typography, Link, Stack } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",   // header ile aynı renk
        color: "white",
        py: 1,
        mt: 4,
        width: "100%",
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        {/* Proje adı ve copyright */}
        <Typography variant="h8" gutterBottom>
          E-Commerce
        </Typography>
        <Typography variant="body2" gutterBottom>
          © 2025 E-Ticaret. Tüm hakları saklıdır.
        </Typography>

        {/* Menü Linkleri */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt:1 }}
        >
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
      </Container>
    </Box>
  );
}
