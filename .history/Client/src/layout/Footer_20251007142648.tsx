import { Box, Typography, Stack, Link as MuiLink } from "@mui/material";
import { Link } from "react-router";

export default function Footer() {
  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #000000 0%, #333333 100%)",
        color: "white",
        textAlign: "center",
        py: 3,
        boxShadow: "0 -4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
        E-Commerce
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
        © 2025 E-Ticaret. Tüm hakları saklıdır.
      </Typography>
      <Stack direction="row" justifyContent="center" spacing={3}>
        <MuiLink component={Link} to="/" color="inherit" underline="hover">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/catalog" color="inherit" underline="hover">
          Catalog
        </MuiLink>
        <MuiLink component={Link} to="/about" color="inherit" underline="hover">
          About
        </MuiLink>
        <MuiLink component={Link} to="/contact" color="inherit" underline="hover">
          Contact
        </MuiLink>
      </Stack>
    </Box>
  );
}
