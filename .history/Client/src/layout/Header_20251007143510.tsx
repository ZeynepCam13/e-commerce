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
import React, { useState } from "react";

const links = [
  { title: "Home", to: "/" },
  { title: "Catalog", to: "/catalog" },
  { title: "About", to: "/about" },
  { title: "Contact", to: "/contact" },
];

const authLinks = [
  { title: "Login", to: "/login" },
  { title: "Register", to: "/register" },
];

// minimalist siyah-gri tonlar
const navStyles = {
  color: "#000",
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: 500,
  "&:hover": { color: "#555" },
  "&.active": { color: "#000", fontWeight: 600, borderBottom: "1px solid #000" },
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
    <AppBar
      position="static"
      sx={{
        mb: 4,
        backgroundColor: "#fff",
        color: "#000",
        boxShadow: "none",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
        }}
      >
        {/* Sol taraf - Logo */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display","serif"',
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          E-COMMERCE
        </Typography>

        {/* Orta menü */}
        <Stack direction="row" spacing={2}>
          {links.map((link) => (
            <Button key={link.to} component={NavLink} to={link.to} sx={navStyles}>
              {link.title}
            </Button>
          ))}
        </Stack>

        {/* Arama Çubuğu */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "35%",
          }}
        >
          <TextField
            placeholder="Search products..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 20,
              "& fieldset": { border: "1px solid #ddd" },
              "&:hover fieldset": { borderColor: "#000" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <Search sx={{ color: "#555" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Sağ taraf */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton component={Link} to="/cart" size="large" sx={{ color: "#000" }}>
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
                sx={{
                  color: "#000",
                  textTransform: "none",
                  "&:hover": { color: "#555" },
                }}
              >
                {user.name}
              </Button>

              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ mt: 1 }}
              >
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
            <Stack direction="row" spacing={1}>
              {authLinks.map((link) => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={{
                    color: "#000",
                    textTransform: "none",
                    "&:hover": { color: "#555" },
                  }}
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
