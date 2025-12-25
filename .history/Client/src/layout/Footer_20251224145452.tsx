import { Box, Typography, Stack, Link as MuiLink } from "@mui/material";
import { Link } from "react-router"; // react-router-dom kullanımı daha stabildir

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #eeeeee", // Daha yumuşak bir çizgi
        color: "#111", // Tam siyah yerine çok koyu gri daha premium durur
        textAlign: "center",
        py: 5, // Biraz daha genişlik ferahlık katar
        mt: 'auto'
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 2, 
          fontWeight: 600, // Yazıyı kalınlaştırdık
          color: "text.secondary",
          letterSpacing: "0.5px" // Harf aralığına estetik kattık
        }}
      >
        © 2025 E-COMMERCE. TÜM HAKLARI SAKLIDIR.
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={4}>
        {[
          { title: "Home", to: "/" },
          { title: "İletişim", to: "/contact" },
          { title: "İndirim", to: "/catalog" } // Linkleri güncelledim
        ].map((item) => (
          <MuiLink
            key={item.title}
            component={Link}
            to={item.to}
            color="inherit"
            underline="none" // Alt çizgiyi kaldırdık, daha modern
            sx={{
              fontSize: "0.85rem",
              fontWeight: 700, // Header'daki gibi kalın yaptık
              textTransform: "uppercase", // Büyük harf her zaman daha profesyonel durur
              letterSpacing: "1px",
              transition: "0.2s",
              "&:hover": {
                color: "secondary.main", // Üzerine gelince renk değişimi
                opacity: 0.7
              }
            }}
          >
            {item.title}
          </MuiLink>
        ))}
      </Stack>
    </Box>
  );
}