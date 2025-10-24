import { createTheme } from "@mui/material/styles";


export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1e3a8a" }, // lacivert mavi
    secondary: { main: "#f59e0b" }, // amber (sıcak vurgu)
    background: { default: "#f7f8fa", paper: "#ffffff" },
    text: { primary: "#1f2937", secondary: "#4b5563" },
  },
  typography: {
    fontFamily: '"Poppins","Roboto","Arial",sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        },
      },
    },
  },
});

