import { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  Typography,
  Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import requests from "../../api/requests";
import { ICategory } from "../../model/ICategory";

export default function CategoryMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    requests.Category.tree().then((data) => setCategories(data));
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        onMouseEnter={handleMouseEnter}
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <MenuIcon />
        <Typography sx={{ ml: 1 }}>Kategori</Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMouseLeave}
        MenuListProps={{ onMouseLeave: handleMouseLeave }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {categories.map((cat) => (
          <Box key={cat.id}>
            {/* ANA KATEGORİ */}
            <MenuItem
              sx={{ fontWeight: "bold" }}
            >
              {cat.name}
            </MenuItem>

            {/* ALT KATEGORİLER */}
            {cat.subCategories?.map((sub) => (
              <Box key={sub.id} sx={{ ml: 2 }}>
                <MenuItem>{sub.name}</MenuItem>

                {/* ALT-ALT KATEGORİ */}
                {sub.subSubCategories?.map((ss) => (
                  <MenuItem
                    key={ss.id}
                    sx={{ ml: 4 }}
                  >
                    {ss.name}
                  </MenuItem>
                ))}
              </Box>
            ))}
          </Box>
        ))}
      </Menu>
    </>
  );
}
