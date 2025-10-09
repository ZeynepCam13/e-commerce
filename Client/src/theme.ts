import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a1a1a", // siyah ton (metin)
    },
    secondary: {
      main: "#bdbdbd", // açık gri
    },
    background: {
      default: "#faf9f7", // kırık beyaz arka plan
      paper: "#ffffff", // kart arka planı
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: '"Poppins","Roboto","Arial",sans-serif',
    h1: {
      fontFamily: '"Playfair Display","serif"',
      fontWeight: 600,
      fontSize: "3rem",
      letterSpacing: "-0.5px",
      color: "#111",
    },
    h2: {
      fontFamily: '"Playfair Display","serif"',
      fontWeight: 500,
      letterSpacing: "-0.5px",
    },
    h6: {
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "1px",
      fontSize: "0.9rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "0.5px",
    },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#000",
          boxShadow: "none",
          borderBottom: "1px solid #e5e5e5",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: "8px 20px",
          fontSize: "0.9rem",
          "&:hover": {
            backgroundColor: "#000",
            color: "#fff",
          },
        },
      },
    },
  },
});
