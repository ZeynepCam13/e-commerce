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
  Container,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router"; 
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Typography, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { clearCart } from "../features/cart/cartSlice";
import {
  FavoriteBorder,
  KeyboardArrowDown,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


import CategoryMenu from "../features/category/CategoryMenu";

const links = [
  { title: "Tüm Ürünler", to: "/catalog" },
  { title: "İndirim", to: "/contact" },
];

const authLinks = [
  { title: "Giriş Yap", to: "/login" },
  { title: "Üye Ol", to: "/register" },
];

const navStyles = {
  color: "text.primary",
  textDecoration: "none",
  typography: "body2",
  fontWeight: 600,
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
      position="sticky" 
      sx={{ 
        backgroundColor: "white", 
        color: "black", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        borderBottom: "1px solid #eee",
        width:"%100" 
      }}
    >
      <Container maxWidth={false} sx={{px:{xs:2,md:4}}}>
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 70,
          }}
        >
         
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ 
                fontWeight: 800, 
                textDecoration: "none", 
                color: "black",
                letterSpacing: -1,
                mr: 2
              }}
            >
              E-TİCARET
            </Typography>

            {!isAdmin && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CategoryMenu />
                {links.map((link) => (
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
          </Stack>
          {!isAdmin && (
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                flexGrow: 1,
                mx: 4,
                maxWidth: 500,
                display: { xs: "none", md: "block" },
              }}
            >
              <TextField
                placeholder="Aradığınız ürünü yazınız..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    "& fieldset": { border: "none" },
                    "&:hover": { backgroundColor: "#eee" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          <Stack direction="row" spacing={1} alignItems="center">
            {!isAdmin && (
              <>
                <IconButton component={Link} to="/favorites" sx={{ color: "black" }}>
                  <FavoriteBorder />
                </IconButton>
                <IconButton
                  component={Link}
                  to="/cart"
                  sx={{ color: "black" }}
                >
                  <Badge badgeContent={itemCount} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </>
            )}

            {isAdmin && (
              <Button component={NavLink} to="/admin" variant="outlined" sx={{ mr: 2, borderRadius: 2 }}>
                Admin Paneli
              </Button>
            )}

            {user ? (
              <>
                <Button
                  onClick={handleUserClick}
                  startIcon={<AccountCircleIcon />}
                  endIcon={<KeyboardArrowDown />}
                  sx={{ 
                    ...navStyles, 
                    textTransform: "none",
                    bgcolor: "#f5f5f5",
                    px: 2,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#eee" }
                  }}
                >
             
                  {user?.name || "Hesabım"}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={openUserMenu}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: { mt: 1, minWidth: 180, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }
                  }}
                >
                  {!isAdmin && (
                    <MenuItem component={Link} to="/orders" onClick={handleClose}>
                      <ListItemIcon><ListAltIcon fontSize="small" /></ListItemIcon>
                      Siparişlerim
                    </MenuItem>
                  )}
                  <MenuItem component={Link} to="/settings" onClick={handleClose}>
                    <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                    Ayarlar
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      dispatch(logout());
                      dispatch(clearCart());
                    }}
                    sx={{ color: "error.main" }}
                  >
                    <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                    Çıkış Yap
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
                    variant={link.to === "/register" ? "contained" : "text"}
                    sx={{ 
                      ...navStyles, 
                      borderRadius: 2,
                      bgcolor: link.to === "/register" ? "black" : "transparent",
                      color: link.to === "/register" ? "white" : "black",
                      "&:hover": { bgcolor: link.to === "/register" ? "#333" : "#f5f5f5" }
                    }}
                  >
                    {link.title}
                  </Button>
                ))}
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

