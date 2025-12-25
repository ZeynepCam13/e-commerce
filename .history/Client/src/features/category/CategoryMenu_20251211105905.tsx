import { useState, useEffect } from "react";
import {
  Box,
  Popover,

  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import requests from "../../api/requests";
import { ICategory } from "../../model/ICategory";
import { useNavigate } from "react-router";
import { ISubSubCategory } from "../../model/ISubSubCategory";


export default function CategoryMenu() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<any | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    requests.Category.tree().then((data) => setCategories(data));
  }, []);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveCategory(null);
    setActiveSubCategory(null);
  };

  const handleCategoryHover = (cat: ICategory) => {
    setActiveCategory(cat);
    setActiveSubCategory(null);
  };

  const handleSubCategoryHover = (sub: any) => {
    setActiveSubCategory(sub);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        size="large"
        onMouseEnter={handleOpen}
        sx={{ ml: 1 }}
      >
        <MenuIcon />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ sx: { display: "flex", padding: "10px" } }}
      >
        {/* ANA KATEGORİLER */}
        <Box sx={{ width: 200, borderRight: "1px solid #eee" }}>
          <List>
            {categories.map((cat) => (
              <ListItemButton
                key={cat.id}
                onMouseEnter={() => handleCategoryHover(cat)}
              >
                <ListItemText primary={cat.name} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* ALT KATEGORİLER */}
        {activeCategory && (
          <Box sx={{ width: 220, borderRight: "1px solid #eee" }}>
            <List>
              {activeCategory.subCategories.map((sub) => (
                <ListItemButton
                  key={sub.id}
                  onMouseEnter={() => handleSubCategoryHover(sub)}
                >
                  <ListItemText primary={sub.name} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        {/* ALT–ALT KATEGORİLER */}
        {activeSubCategory && (
          <Box sx={{ width: 220 }}>
            <List>
              {activeSubCategory.subSubCategories.map((ss:ISubSubCategory) => (
                <ListItemButton
                  key={ss.id}
                  onClick={() => {
                    navigate(`/catalog?subsub=${ss.id}`);
                    handleClose();
                  }}
                >
                  <ListItemText primary={ss.name} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}
      </Popover>
    </>
  );
}
