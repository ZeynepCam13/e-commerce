import { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import requests from "../../api/requests";

export default function CategoryMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    requests.Category.list().then((data) => setCategories(data));
  }, []);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton color="inherit" size="large" onClick={handleOpen}>
        <MenuIcon />
      </IconButton>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        {categories.map((cat) => (
          <div key={cat.id}>
            <MenuItem>
              <Typography sx={{ fontWeight: "bold" }}>{cat.name}</Typography>
            </MenuItem>

            {/* ALT KATEGORİLER */}
            {cat.subCategories?.map((sub: any) => (
              <MenuItem key={sub.id} sx={{ ml: 3 }}>
                • {sub.name}
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </>
  );
}
