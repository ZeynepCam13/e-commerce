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
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router";
import { logout } from "../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { clearCart } from "../features/cart/cartSlice";
import { KeyboardArrowDown, Search, ShoppingCart, Menu } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import requests from "../api/requests";
import { ICategory } from "../model/ICategory";

const links = [
  { title: "E-COMMERCE", to: "/" },
  { title: "Tüm Ürünler", to: "/catalog" },
  { title: "Hakkımızda", to: "/about" },
  { title: "İletişim", to: "/contact" },
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
        {/* Sol taraf: Kategoriler + Menü bağlantıları */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Hamburger Menü */}
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <Menu />
            <span style={{ fontSize: "0.9rem", marginLeft: 5 }}>KATEGORİLER</span>
          </IconButton>

          {/* Drawer Menü */}
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

          {/* Sayfa bağlantıları */}
          {links.map((link) => (
            <Button key={link.to} component={NavLink} to={link.to} sx={navStyles}>
              {link.title.toUpperCase()}
            </Button>
          ))}
        </Stack>

        {/* Arama kutusu */}
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

        {/* Sağ taraf */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton component={Link} to="/cart" size="large" color="inherit">
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <Button
                endIcon={<KeyboardArrowDown />}
                sx={navStyles}
                onClick={() => {
                  dispatch(logout());
                  dispatch(clearCart());
                }}
              >
                {user.name}
              </Button>
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
