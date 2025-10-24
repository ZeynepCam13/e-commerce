import { KeyboardArrowDown, ShoppingCart, Search } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router";
import { logout } from "../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { clearCart } from "../features/cart/cartSlice";
import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import requests from "../api/requests";
import { ICategory } from "../model/ICategory";

const links = [
  { title: "E-COMMERCE", to: "/" },
  { title: "Tüm Ürünler", to: "/catalog" },
  { title: "Hakkımızda", to: "/about" },
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
  const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);
  const [catMenu, setCatMenu] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Kategorileri al
  useEffect(() => {
    requests.Category.list().then((data) => setCategories(data));
  }, []);

  // Kullanıcı menüsü
  const handleUserMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setUserMenu(e.currentTarget);
  const handleUserMenuClose = () => setUserMenu(null);

  // Kategori menüsü
  const handleCatMenuOpen = (e: React.MouseEvent<HTMLElement>) => setCatMenu(e.currentTarget);
  const handleCatMenuClose = () => setCatMenu(null);

  const handleSelectCategory = (id: number) => {
    navigate(`/catalog?category=${id}`);
    handleCatMenuClose();
  };

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchTerm.trim() !== "") navigate(`/catalog?search=${searchTerm}`);
    else navigate("/catalog");
  }

  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          px: 2,
        }}
      >
        {/* Sol taraf */}
        <Stack direction="row" spacing={1} alignItems="center">
          {links.map((link) => (
            <Button
              key={link.to}
              component={NavLink}
              to={link.to}
              sx={{ ...navStyles, fontWeight: 600 }}
            >
              {link.title.toUpperCase()}
            </Button>
          ))}

          {/* KATEGORİLER MENÜSÜ */}
          <Box onMouseEnter={handleCatMenuOpen}>
            <Stack direction="row" alignItems="center" sx={{ cursor: "pointer", ml: 1 }}>
              <MenuIcon />
              <Typography sx={{ fontSize: 14, ml: 0.5 }}>KATEGORİLER</Typography>
            </Stack>
          </Box>

          <Menu
            anchorEl={catMenu}
            open={Boolean(catMenu)}
            onClose={handleCatMenuClose}
            MenuListProps={{ onMouseLeave: handleCatMenuClose }}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} onClick={() => handleSelectCategory(c.id)}>
                {c.name}
              </MenuItem>
            ))}
          </Menu>
        </Stack>

        {/* Orta kısım - Arama çubuğu */}
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
              backgroundColor: "white",
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
                id="user-button"
                onClick={handleUserMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={navStyles}
              >
                {user.name}
              </Button>

              <Menu
                id="user-menu"
                anchorEl={userMenu}
                open={Boolean(userMenu)}
                onClose={handleUserMenuClose}
              >
                <MenuItem component={Link} to="/orders">
                  Siparişler
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(logout());
                    dispatch(clearCart());
                  }}
                >
                  Çıkış Yap
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row">
              {authLinks.map((link) => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={navStyles}
                >
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
