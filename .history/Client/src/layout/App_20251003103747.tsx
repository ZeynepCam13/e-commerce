import { useEffect, useState } from "react";
import { Box, CircularProgress, Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch } from "../store/store";
import { getCart } from "../features/cart/cartSlice";
import { getUser } from "../features/account/accountSlice";
import Header from "./Header";
import Footer from "./Footer";


function App() {  

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp= async ()=>{
    
   await dispatch(getUser());
   await dispatch(getCart());

  }
  
  useEffect(() => {
    initApp().then(()=>setLoading(false));
  }, []);

  if(loading) return <CircularProgress />;

  return (
  <Box display="flex" flexDirection="column" minHeight="100vh">
      <CssBaseline />
      <ToastContainer position="bottom-right" hideProgressBar />
      <Header />

      {/* İçerik alanı */}
      <Container sx={{ flex: 1, mt: 2 }}>
        <Outlet />
      </Container>

      {/* Footer her zaman altta */}
      <Footer />
    </Box>
  );
  
}

export default App;
