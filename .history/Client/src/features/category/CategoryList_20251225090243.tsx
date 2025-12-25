import { useEffect, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import requests from "../../api/requests";
import { ICategory } from "../../model/ICategory";

interface Props {
  onCategorySelect: (categoryId: number) => void;
}

export default function CategoryList({ onCategorySelect: _onCategorySelect }: Props) {
  const [categories, setCategories] = useState<ICategory[]>([]);
 
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

  const [openSubCategoryId, setOpenSubCategoryId] = useState<number | null>(
    null
  );

  useEffect(() => {
    requests.Category.tree()
      .then((data) => {
 
        console.log("Kategoriler Başarıyla Geldi:", data);
        setCategories(data);
      })
      .catch((error) => {

        console.error("Kategori verisi çekme hatası:", error);
      });
  }, []);
  const handleCategoryClick = (id: number) => {
 
    setOpenCategoryId((prev) => (prev === id ? null : id));
    
  };

  const handleSubCategoryClick = (id: number) => {
 
    setOpenSubCategoryId((prev) => (prev === id ? null : id));
    
  };

  const handleSubSubCategoryClick = (id: number) => {
    console.log("Alt-alt kategori seçildi:", id);

  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        KATEGORİLER
      </Typography>

      <List component="nav" disablePadding>
        {categories.map((cat) => (
          <div key={cat.id}>
          
            <ListItemButton onClick={() => handleCategoryClick(cat.id)}>
              <ListItemText primary={cat.name} />
         
              {cat.subCategories && cat.subCategories.length > 0 && (
                openCategoryId === cat.id ? <ExpandLess /> : <ExpandMore />
              )}
            </ListItemButton>

  
            <Collapse
              in={openCategoryId === cat.id} 
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding sx={{ pl: 2 }}>
                {cat.subCategories?.map((sub) => (
                  <div key={sub.id}>
                  
                    <ListItemButton
                      onClick={() => handleSubCategoryClick(sub.id)}
                    >
                      <ListItemText primary={sub.name} />
                      
                      {sub.subSubCategories && sub.subSubCategories.length > 0 && (
                          openSubCategoryId === sub.id ? <ExpandLess /> : <ExpandMore />
                      )}
                    </ListItemButton>
                    <Collapse
                      in={openSubCategoryId === sub.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding sx={{ pl: 2 }}>
                        {sub.subSubCategories?.map((ss) => (
                          <ListItemButton
                            key={ss.id}
                            onClick={() => handleSubSubCategoryClick(ss.id)}
                          >
                            <ListItemText primary={ss.name} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </div>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </Paper>
  );
}