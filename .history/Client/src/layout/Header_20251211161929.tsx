import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
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
import {
  KeyboardArrowDown,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// YENİ — 3 panelli menu
import CategoryMenu from "../features/category/CategoryMenu";

const links = [
  { title: "E-TİCARET", to: "/" },
  { title: "Tüm Ürünler", to: "/catalog" },
  { title: "İndirim", to: "/contact" },
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

  const itemCount = cart?.cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openUserMenu = Boolean(anchorEl);

  const isAdmin = user?.role === "Admin";

  function handleUserClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") navigate(`/catalog?search=${searchTerm}`);
    else navigate("/catalog");
  };

  return (
    <AppBar
      position="static"
      sx={{ mb: 4, backgroundColor: "white", color: "black" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: isAdmin ? "flex-end" : "space-between",
          alignItems: "center",
          px: 2,
          flexWrap: "wrap",
        }}
      >
        {/* SOL TARAF */}
        {!isAdmin && (
          <>
            <Stack direction="row" spacing={1} alignItems="center">
              {/* YENİ — MEGA MENU */}
              <CategoryMenu />

              {links.map((link) => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={navStyles}
                >
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

        {/* SAĞ TARAF */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!isAdmin && (
            <>
              <IconButton
                component={Link}
                to="/cart"
                size="large"
                color="inherit"
              >
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

          {/* USER MENU */}
          {user ? (
            <>
              <Button
                id="user-button"
                onClick={handleUserClick}
                startIcon={<AccountCircleIcon />}
                endIcon={<KeyboardArrowDown />}
                sx={navStyles}
              >
                {user.name}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={openUserMenu}
                onClose={handleClose}
              >
                {!isAdmin && (
                  <MenuItem component={Link} to="/orders">
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
