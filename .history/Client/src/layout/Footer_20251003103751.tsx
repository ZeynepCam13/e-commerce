import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="body1">E-Commerce</Typography>
      <Typography variant="body2">© 2025 E-Ticaret. Tüm hakları saklıdır.</Typography>
    </Box>
  );
}
