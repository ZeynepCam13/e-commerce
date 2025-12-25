import { useEffect, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Paper,
  Typography
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
  const [open, setOpen] = useState<number | null>(null);
  const [openSub, setOpenSub] = useState<number | null>(null);

  useEffect(() => {
    requests.Category.tree().then((data) => setCategories(data));
  }, []);

  const handleClick = (id: number) => {
    setOpen(open === id ? null : id);
  };

  const handleSubClick = (id: number) => {
    setOpenSub(openSub === id ? null : id);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Kategoriler</Typography>

      <List>
        {categories.map((cat) => (
          <div key={cat.id}>
            {/* ANA KATEGORI */}
            <ListItemButton onClick={() => handleClick(cat.id)}>
              <ListItemText primary={cat.name} />
              {open === cat.id ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open === cat.id}>
              {cat.subCategories?.map((sub) => (
                <div key={sub.id} style={{ marginLeft: 20 }}>
                  {/* ALT KATEGORI */}
                  <ListItemButton onClick={() => handleSubClick(sub.id)}>
                    <ListItemText primary={sub.name} />
                    {openSub === sub.id ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  <Collapse in={openSub === sub.id}>
                    {sub.subSubCategories?.map((ss) => (
                      <ListItemButton
                        key={ss.id}
                        sx={{ ml: 4 }}
                        onClick={() => onCategorySelect(ss.id)}
                      >
                        <ListItemText primary={ss.name} />
                      </ListItemButton>
                    ))}
                  </Collapse>
                </div>
              ))}
            </Collapse>
          </div>
        ))}
      </List>
    </Paper>
  );
}
