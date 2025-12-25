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

export default function CategoryList({ onCategorySelect }: Props) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const [openSubCategoryId, setOpenSubCategoryId] = useState<number | null>(
    null
  );

  useEffect(() => {
    // ÖNEMLİ: Category.list() mutlaka /category/tree çağırmalı
    requests.Category.tree().then((data) => {
      console.log("Kategoriler:", data); // İstersen buraya bak, hiyerarşi geliyor mu diye
      setCategories(data);
    });
  }, []);

  const handleCategoryClick = (id: number) => {
    setOpenCategoryId((prev) => (prev === id ? null : id));
    onCategorySelect(id); // Üst kategoriye göre filtreleme devam etsin
  };

  const handleSubCategoryClick = (id: number) => {
    setOpenSubCategoryId((prev) => (prev === id ? null : id));
    // İstersen burada subCategoryId ile filtreleme yapacak başka callback de
    // tetikleyebilirsin. Şimdilik sadece aç/kapa yapıyoruz.
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        KATEGORİLER
      </Typography>

      <List component="nav" disablePadding>
        {categories.map((cat) => (
          <div key={cat.id}>
            {/* ANA KATEGORİ */}
            <ListItemButton onClick={() => handleCategoryClick(cat.id)}>
              <ListItemText primary={cat.name} />
              {openCategoryId === cat.id ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            {/* ALT KATEGORİLER */}
            <Collapse
              in={openCategoryId === cat.id}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {cat.subCategories?.map((sub) => (
                  <div key={sub.id}>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => handleSubCategoryClick(sub.id)}
                    >
                      <ListItemText primary={sub.name} />
                      {openSubCategoryId === sub.id ? (
                        <ExpandLess />
                      ) : (
                        sub.subSubCategories &&
                        sub.subSubCategories.length > 0 && <ExpandMore />
                      )}
                    </ListItemButton>

                    {/* ALT–ALT KATEGORİLER */}
                    <Collapse
                      in={openSubCategoryId === sub.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {sub.subSubCategories?.map((ss) => (
                          <ListItemButton
                            key={ss.id}
                            sx={{ pl: 6 }}
                            // İstersen burada subSubCategoryId ile filtreleme yap
                            onClick={() => console.log("Alt-alt:", ss.id)}
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
