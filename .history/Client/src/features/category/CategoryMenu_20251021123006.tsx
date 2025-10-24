import { useEffect, useState } from "react";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import requests from "../../api/requests";
import { ICategory } from "../../model/ICategory";
import { useNavigate } from "react-router";

export default function CategoryMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    requests.Category.list().then((data) => setCategories(data));
  }, []);

 
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleSelect = (id: number) => {
    navigate(`/catalog?category=${id}`);
    setAnchorEl(null);
  };

  return (
    <>
      {/* Hover ile açılan menü ikonu */}
      <IconButton
        color="inherit"
        size="large"
        sx={{ ml: 1 }}
        onMouseEnter={handleMouseEnter}
      >
        <MenuIcon />
      </IconButton>

      {/* Menü */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMouseLeave}
        MenuListProps={{
          onMouseLeave: handleMouseLeave,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {categories.map((c) => (
          <MenuItem
            key={c.id}
            onClick={() => handleSelect(c.id)}
            sx={{ minWidth: 180 }}
          >
            <Typography>{c.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
