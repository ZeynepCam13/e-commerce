import { Box, Typography, Stack, Link as MuiLink } from "@mui/material";
import { Link } from "react-router";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5e5e5",
        color: "#000",
        textAlign: "center",
        typography:"body2",
        py: 3,
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        © 2025 E-Commerce. Tüm Hakları Saklıdır.
      </Typography>
      <Stack direction="row" justifyContent="center" spacing={3}>
        <MuiLink component={Link} to="/" color="inherit" underline="hover">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/about" color="inherit" underline="hover">
          İletişim
        </MuiLink>
        <MuiLink component={Link} to="/contact" color="inherit" underline="hover">
          İndirim
        </MuiLink>
      </Stack>
    </Box>
  );
}
