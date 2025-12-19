import { useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material";
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
    requests.Category.tree().then((data) => setCategories(data));
  }, []);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const goCategory = (categoryId: number) => {
    navigate(`/catalog?category=${categoryId}`);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        size="large"
        sx={{ ml: 1 }}
        onMouseEnter={handleOpen}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            onMouseLeave: handleClose, // Menüden çıkınca kapanır
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {categories.map((cat) => (
          <div key={cat.id}>
            <MenuItem onClick={() => goCategory(cat.id)}>
              <ListItemText primary={cat.name} />
            </MenuItem>

            {cat.subCategories.map((sub) => (
              <MenuItem key={sub.id} sx={{ pl: 4 }}>
                <ListItemText primary={sub.name} />
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </>
  );
}
