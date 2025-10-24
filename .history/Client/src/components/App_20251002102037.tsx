import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { Container, CssBaseline, Box, CircularProgress } from "@mui/material";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartContextProvider, useCartContext } from "../../context/CartContext";
import { useEffect, useState } from "react";
import requests from "../api/requests";

function AppContent() {
  const { setCart } = useCartContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requests.Cart.get()
      .then((cart) => setCart(cart))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header />
      <Container sx={{ flex: 1, my: 2 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <CartContextProvider>
      <AppContent />
    </CartContextProvider>
  );
}

export default App;


