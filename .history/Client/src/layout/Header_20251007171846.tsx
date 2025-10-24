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
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router";
import { logout } from "../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { clearCart } from "../features/cart/cartSlice";
import React, { useState } from "react";

const links = [
  { title: "Home", to: "/" },
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
  const open = Boolean(anchorEl);
  const [searchTerm, setSearchTerm] = useState("");

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
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
        {/* Sol taraf */}
        <Stack direction="row" spacing={1}>
          {links.map((link) => (
            <Button key={link.to} component={NavLink} to={link.to} sx={navStyles}>
              {link.title.toUpperCase()}
            </Button>
          ))}
        </Stack>

        {/* Orta kısım - Arama Çubuğu */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40%",
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
