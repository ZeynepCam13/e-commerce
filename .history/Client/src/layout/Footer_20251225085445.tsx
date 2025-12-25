import { Box, Typography, Stack, Link as MuiLink } from "@mui/material";
import { Link } from "react-router"; 

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #eeeeee", 
        color: "#111", 
        textAlign: "center",
        py: 5,
        mt: 'auto'
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 2, 
          fontWeight: 600,
          color: "text.secondary",
          letterSpacing: "0.5px" 
        }}
      >
        © 2025 E-COMMERCE. TÜM HAKLARI SAKLIDIR.
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={4}>
        {[
          { title: "Home", to: "/" },
          { title: "İletişim", to: "/contact" },
          { title: "İndirim", to: "/catalog" }
        ].map((item) => (
          <MuiLink
            key={item.title}
            component={Link}
            to={item.to}
            color="inherit"
            underline="none" 
            sx={{
              fontSize: "0.85rem",
              fontWeight: 700, 
              textTransform: "uppercase", 
              transition: "0.2s",
              "&:hover": {
                color: "secondary.main", 
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