import { useEffect, useState } from "react";
import { List, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import requests from "../../api/requests";
import { ICategory } from "../../model/ICategory";

interface Props {
  onCategorySelect: (categoryId: number) => void;
}

export default function CategoryList({ onCategorySelect }: Props) {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    requests.Category.list().then(data => setCategories(data));
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Kategoriler</Typography>
      <List>
        {categories.map(c => (
          <ListItemButton key={c.id} onClick={() => onCategorySelect(c.id)}>
            <ListItemText primary={c.name} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
