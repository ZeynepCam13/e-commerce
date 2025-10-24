import { Box, Typography, Link, Stack } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 2,
        px: 2,
        backgroundColor: "#a40000 ",
        color: "white",
        textAlign: "center",
      }}
    >
      <Stack direction="row" spacing={3} justifyContent="center">
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

      <Typography variant="body2" sx={{ mt: 1 }}>
        © {new Date().getFullYear()} E-TİCARET. Tüm hakları saklıdır.
      </Typography>
    </Box>
  );
}
