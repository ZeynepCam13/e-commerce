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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const open = Boolean(anchorEl);

  // 🔹 Kategorileri API'den getir
  useEffect(() => {
    requests.Category.list().then((data) => setCategories(data));
  }, []);

  // 🔹 Hover açma & kapama
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleSelectCategory = (id: number) => {
    navigate(`/catalog?category=${id}`);
    setAnchorEl(null);
  };

  // 🔹 Kullanıcı menüsü (profil)
  function handleMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchTerm.trim() !== "") navigate(`/catalog?search=${searchTerm}`);
    else navigate("/catalog");
  }

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Sol taraf - Sayfa linkleri */}
        <Stack direction="row" spacing={1} alignItems="center">
          {links.map((link) => (
            <Button key={link.to} component={NavLink} to={link.to} sx={navStyles}>
              {link.title.toUpperCase()}
            </Button>
          ))}

          {/* 🔹 Hover ile açılan kategori menüsü */}
          <Box onMouseEnter={handleMouseEnter}>
            <IconButton color="inherit" size="large">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMouseLeave}
              MenuListProps={{ onMouseLeave: handleMouseLeave }}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} onClick={() => handleSelectCategory(c.id)}>
                  <Typography>{c.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
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

        {/* Sağ taraf - Sepet ve Kullanıcı */}
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
                onClick={handleMenuClick}
                endIcon={<KeyboardArrowDown />}
                sx={navStyles}
              >
                {user.name}
              </Button>

              <Menu id="user-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
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
