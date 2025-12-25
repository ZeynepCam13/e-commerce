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
  // Hangi ana kategorinin açık olduğunu tutar (Level 1)
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  // Hangi alt kategorinin açık olduğunu tutar (Level 2)
  const [openSubCategoryId, setOpenSubCategoryId] = useState<number | null>(
    null
  );

  useEffect(() => {
    requests.Category.tree()
      .then((data) => {
        // Kontrol için konsol logu (Artık başarılı olması bekleniyor)
        console.log("Kategoriler Başarıyla Geldi:", data);
        setCategories(data);
      })
      .catch((error) => {
        // API hatası durumunda (404 veya bağlantı)
        console.error("Kategori verisi çekme hatası:", error);
      });
  }, []);

  // 1. Seviye (Ana Kategori) Tıklama İşlevi
  const handleCategoryClick = (id: number) => {
    // Tıklanan kategori zaten açıksa kapat, kapalıysa aç
    setOpenCategoryId((prev) => (prev === id ? null : id));
    
    // Alt kategorilerin açılmasını engelleyebileceği için şimdilik devre dışı:
    // onCategorySelect(id); 
  };

  // 2. Seviye (Alt Kategori) Tıklama İşlevi
  const handleSubCategoryClick = (id: number) => {
    // Tıklanan alt kategori zaten açıksa kapat, kapalıysa aç
    setOpenSubCategoryId((prev) => (prev === id ? null : id));
    
    // Eğer alt kategori seçimi filtrelemeyi tetikleyecekse buraya eklenmeli
    // onCategorySelect(id);
  };

  // 3. Seviye (Alt-Alt Kategori) Tıklama İşlevi
  const handleSubSubCategoryClick = (id: number) => {
    console.log("Alt-alt kategori seçildi:", id);
    // onCategorySelect(id); // Üçüncü seviye filtrelemesi burada tetiklenir
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        KATEGORİLER
      </Typography>

      <List component="nav" disablePadding>
        {categories.map((cat) => (
          <div key={cat.id}>
            {/* 1. SEVİYE: ANA KATEGORİ */}
            <ListItemButton onClick={() => handleCategoryClick(cat.id)}>
              <ListItemText primary={cat.name} />
              {/* Expand ikonu, alt kategoriler varsa gösterilir */}
              {cat.subCategories && cat.subCategories.length > 0 && (
                openCategoryId === cat.id ? <ExpandLess /> : <ExpandMore />
              )}
            </ListItemButton>

            {/* 2. SEVİYE: ALT KATEGORİLERİ İÇEREN COLLAPSE */}
            <Collapse
              in={openCategoryId === cat.id} // Ana kategori açıksa açılır
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding sx={{ pl: 2 }}> {/* İçeriden başlasın */}
                {cat.subCategories?.map((sub) => (
                  <div key={sub.id}>
                    {/* 2. SEVİYE LİSTE ÖĞESİ */}
                    <ListItemButton
                      onClick={() => handleSubCategoryClick(sub.id)}
                    >
                      <ListItemText primary={sub.name} />
                      {/* Alt-alt kategoriler varsa ikonu göster */}
                      {sub.subSubCategories && sub.subSubCategories.length > 0 && (
                          openSubCategoryId === sub.id ? <ExpandLess /> : <ExpandMore />
                      )}
                    </ListItemButton>

                    {/* 3. SEVİYE: ALT-ALT KATEGORİLERİ İÇEREN COLLAPSE */}
                    <Collapse
                      in={openSubCategoryId === sub.id} // Alt kategori açıksa açılır
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding sx={{ pl: 2 }}> {/* Daha içeriden başlasın */}
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