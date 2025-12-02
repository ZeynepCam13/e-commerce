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
  ListItemIcon,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { clearCart } from "../features/cart/cartSlice";
import { KeyboardArrowDown, Search, ShoppingCart,Menu as MenuIcon} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import requests from "../api/requests";
import { ICategory } from "../model/ICategory";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";



const links = [
  { title: "E-COMMERCE", to: "/" },
  { title: "Tüm Ürünler", to: "/catalog" },
  {title: "İndirim", to:"/contact"}
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
  const isAdmin = user?.role === "Admin";


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
    justifyContent: isAdmin ? "flex-end" : "space-between",
    alignItems: "center",
    px: 2,
    flexWrap: "wrap",
  }}
>

      
      {!isAdmin && (
        <>
          
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
        </>
      )}

      
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {!isAdmin && (
          <>
            <IconButton component={Link} to="/cart" size="large" color="inherit">
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <Button component={NavLink} to="/favorites" color="inherit">
              🤍 Favorilerim
            </Button>
          </>
        )}

       
        {isAdmin && (
  <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
    <Button component={NavLink} to="/admin" sx={{ color: "inherit" }}>
      Yönetim Paneli
    </Button>
  </Box>
)}


        
        {user ? (
          <>
            <Button
              id="user-button"
              onClick={handleMenuClick}
              startIcon={<AccountCircleIcon />}
              endIcon={<KeyboardArrowDown />}
              sx={navStyles}
            >
              {user.name}
            </Button>

            <Menu id="user-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
              
              {!isAdmin && (
                <MenuItem component={Link} to="/orders" >
                  <ListItemIcon>
                   <ListAltIcon fontSize="small" />
                   </ListItemIcon>
                  Siparişlerim
                </MenuItem>
                

              )}

              

              <MenuItem component={Link} to="/settings">
               <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
                Ayarlar
              </MenuItem>

             

              <MenuItem
                onClick={() => {
                  dispatch(logout());
                  dispatch(clearCart());
                }}
              >
                 <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
                Çıkış Yap
              </MenuItem>
              

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
