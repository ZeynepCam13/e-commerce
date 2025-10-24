import {
  AppBar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router";
import { logout } from "../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { clearCart } from "../features/cart/cartSlice";
import { KeyboardArrowDown, Search, ShoppingCart,Menu as MenuIcon} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import requests from "../api/requests";
import { ICategory } from "../model/ICategory";


const links = [
  { title: "E-COMMERCE", to: "/" },
  { title: "Tüm Ürünler", to: "/catalog" },
];

const authLinks = [
  { title: "Giriş Yap", to: "/login" },
  { title: "Üye Ol", to: "/register" },
];

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  "&:hover": { color: "secondary.main" },
  "&.active": { color: "secondary.main" },
};

export default function Header() {
  const { cart } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const itemCount = cart?.cartItems.reduce((total, item) => total + item.quantity, 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
  setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  useEffect(() => {
    requests.Category.list().then((data) => setCategories(data));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") navigate(`/catalog?search=${searchTerm}`);
    else navigate("/catalog");
  };

  const handleCategoryClick = (id: number) => {
    navigate(`/catalog?category=${id}`);
    setDrawerOpen(false);
  };

  return (
    <AppBar position="static" sx={{ mb: 4, backgroundColor: "white", color: "black" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          flexWrap: "wrap",
        }}
      >
        
        <Stack direction="row" spacing={1} alignItems="center">
          
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
          <span style={{ fontSize: "0.9rem", marginLeft: 5 }}>KATEGORİLER</span>
         </IconButton>

          
          <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box sx={{ width: 250, mt: 2 }}>
              <List>
                <ListItem>
                  <ListItemText primary="KATEGORİLER" sx={{ fontWeight: "bold" }} />
                </ListItem>
                {categories.map((cat) => (
                  <ListItem key={cat.id} disablePadding>
                    <ListItemButton onClick={() => handleCategoryClick(cat.id)}>
                      <ListItemText primary={cat.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          
          {links.map((link) => (
            <Button key={link.to} component={NavLink} to={link.to} sx={navStyles}>
              {link.title.toUpperCase()}
            </Button>
          ))}
        </Stack>

        
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            flexGrow: 1,
            width: { xs: "100%", sm: "60%", md: "40%" },
            mx: 2,
            maxWidth: 400,
          }}
        >
          <TextField
            placeholder="Ürün, kategori veya markayı ara"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "#f8f8f8",
              borderRadius: 10,
              "& fieldset": { border: "none" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton component={Link} to="/cart" size="large" color="inherit">
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <Button component={NavLink} to="/favorites" color="inherit">
  🤍Favorilerim
</Button>


          {user ? (
            <>
            {user?.role === "Admin" && (  <Button
        component={NavLink}
        to="/admin"
        sx={{ ...navStyles, ml: 2 }}
      >
        Yönetim Paneli
      </Button>
    )}
            
               <Button id="user-button" onClick={handleMenuClick} endIcon={<KeyboardArrowDown />} sx={navStyles}>{user.name}</Button>
                      
                          <Menu id="user-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <MenuItem component={Link} to="/orders">Siparişlerim</MenuItem>
                            <MenuItem onClick={() => { 
                              dispatch(logout())
                              dispatch(clearCart())
                            }}>Çıkış Yap</MenuItem>
                          </Menu>
            </>
          ) : (
            <Stack direction="row">
              {authLinks.map((link) => (
                <Button key={link.to} component={NavLink} to={link.to} sx={navStyles}>
                  {link.title}
                </Button>
              ))}
            </Stack>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
