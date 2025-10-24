import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6a1b9a", // mor (AppBar, butonlar)
    },
    secondary: {
      main: "#ab47bc", // açık mor
    },
    background: {
      default: "#f5f5f5", // açık gri
      paper: "#ffffff",  // kart ve içerikler beyaz
    },
    text: {
      primary: "#2c2c2c",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Poppins","Roboto","Arial",sans-serif',
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 20px",
        },
        containedPrimary: {
          color: "#fff",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#6a1b9a",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});
