import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6a1b9a", // Mor ana renk (header & footer)
    },
    secondary: {
      main: "#ab47bc", // Açık mor vurgu
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c2c2c",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Poppins","Roboto","Arial",sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #6a1b9a 0%, #8e24aa 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});
