import { ShoppingCart } from "@mui/icons-material";
import { AppBar,Badge,Box,Button,IconButton,Toolbar, Typography } from "@mui/material";
import {  Stack } from "@mui/system";
import { Link, NavLink } from "react-router";
import { useCartContext } from "../../context/CartContext";

const links=[
  { tittle: "Home",to: "/"},
  { tittle: "Catalog",to: "/catalog"},
  { tittle: "About",to: "/about"},
  { tittle: "Contact",to: "/contact"},
  {tittle: "Error", to:"/error"}

]

const navstyles={
  color:"inherit",
  tectDecoration:"none",
  "&:hover":{
    color:"text.primary"
  }
}

export default function Header(props: any){  
  const{cart}= useCartContext();  
  const itemcount=cart?.cartItems.reduce((total,item)=> total+ item.quantity,0)
  return(
    <AppBar position="static" sx={{mb:4,backgroundColor:"#a40000" }}>
        <Toolbar sx={{display:"flex",justifyContent:"space-between"}}>
          <Box sx={{display:"flex",alignItems:"center"}}>
            <Typography variant="h6">E-TİCARET</Typography>

            <Stack direction="row">
              {links.map(link=>
              <Button key={link.to} component={NavLink} to ={link.to} sx={navstyles}>{link.tittle}</Button> 
                )}
            </Stack>

          </Box>

          <Box sx={{display:"flex",alignItems:"center"}}>
            <IconButton component={Link} to="/cart" size="large" edge="start" color="inherit">
              <Badge badgeContent={itemcount} color="secondary">
                <ShoppingCart></ShoppingCart>
              </Badge>

            </IconButton>

          </Box>
            
        </Toolbar>
    </AppBar>
  );

}
