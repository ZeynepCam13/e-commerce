import { KeyboardArrowDown, ShoppingCart, Search } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  InputAdornment,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router";
import { logout } from "../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { clearCart } from "../features/cart/cartSlice";
import React, { useState } from "react";

const links = [
  { title: "Home", to: "/" },
  { title: "Catalog", to: "/catalog" },
  { title: "About", to: "/about" },
  { title: "Contact", to: "/contact" },
  { title: "Error", to: "/error" },
];

const authLinks = [
  { title: "Login", to: "/login" },
  { title: "Register", to: "/register" },
];

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  "&:hover": {
    color: "text.primary",
  },
  "&.active": {
    color: "warning.main",
  },
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
    if (searchTerm.trim() !== "") {
      navigate(`/catalog?search=${searchTerm}`);
    } else {
      navigate("/catalog");
    }
  }

  return (
    <AppBar position="static" sx={{ mb: 4, backgroundColor: "#1976d2" }}>
      <Toolbar
        disableGutters
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}
      >
        {/* Sol taraf - linkler */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Stack direction="row">
            {links.map((link) => (
              <Button key={link.to} component={NavLink} to={link.to} sx={navStyles}>
                {link.title.toUpperCase()}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Orta kısım - arama çubuğu */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            flexGrow: 2,
            mx: 4,
            maxWidth: 600,
          }}
        >
          <TextField
            placeholder="Aradığınız ürün, kategori veya markayı yazınız"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
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

        {/* Sağ taraf - sepet ve kullanıcı */}
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
                  Orders
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(logout());
                    dispatch(clearCart());
                  }}
                >
                  Logout
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
