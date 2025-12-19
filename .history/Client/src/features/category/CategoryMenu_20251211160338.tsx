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
import { ISubCategory } from "../../model/ISubCategory";
import { ISubSubCategory } from "../../model/ISubSubCategory";
import { useNavigate } from "react-router";

export default function CategoryMenu() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] =
    useState<ISubCategory | null>(null);

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

  const handleSubCategoryHover = (sub: ISubCategory) => {
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
                onClick={() => {
                  navigate(`/catalog?category=${cat.id}`);
                  handleClose();
                }}
              >
                <ListItemText primary={cat.name} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* ALT KATEGORİLER */}
{activeCategory &&
  activeCategory.subCategories &&
  activeCategory&&activeCategory.subCategories&& (
    <Box sx={{ width: 220, borderRight: "1px solid #eee" }}>
      <List>
        {activeCategory.subCategories.map((sub: ISubCategory) => (
          <ListItemButton
            key={sub.id}
            onMouseEnter={() => handleSubCategoryHover(sub)}
            onClick={() => {
              navigate(`/catalog?subcategory=${sub.id}`);
              handleClose();
            }}
          >
            <ListItemText primary={sub.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
)}

      

        {/* ALT–ALT KATEGORİLER */}
{activeSubCategory && activeSubCategory.subSubCategories && 
 (
  <Box sx={{ width: 220 }}>
    <List>
      {activeSubCategory.subSubCategories.map((ss: ISubSubCategory) => (
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
