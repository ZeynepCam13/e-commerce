import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#212121", // koyu gri-siyah ton (header, butonlar)
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9e9e9e", // açık gri vurgu
    },
    background: {
      default: "#f5f5f5", // sayfa arka planı
      paper: "#ffffff", // kartlar ve içerikler
    },
    text: {
      primary: "#1c1c1c",
      secondary: "#5f5f5f",
    },
  },
  typography: {
    fontFamily: '"Poppins","Roboto","Arial",sans-serif',
    h6: { fontWeight: 700, color: "#212121" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #000000 0%, #333333 100%)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 18px",
          "&:hover": {
            backgroundColor: "#000",
            color: "#fff",
          },
        },
      },
    },
  },
});
