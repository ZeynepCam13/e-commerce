import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  TextField,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  Stack,
  TableContainer,
  Paper,
} from "@mui/material";
import { Edit, Delete, Save } from "@mui/icons-material";
import { toast } from "react-toastify";
import requests from "../../api/requests";
import { IProduct } from "../../model/IProduct";

interface Props {
  onEdit: (product: IProduct) => void;
}

export default function ProductTable({ onEdit }: Props) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [discounts, setDiscounts] = useState<Record<number, number | undefined>>({});

  const loadProducts = () => {
    requests.Catalog.list().then((data) => setProducts(data));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu ürünü silmek istediğine emin misin?")) {
      try {
        await requests.Admin.deleteProduct(id);
        toast.success("Ürün başarıyla silindi!");
        loadProducts();
      } catch {
        toast.error("Silme işlemi başarısız!");
      }
    }
  };

  const handleUpdateDiscount = async (id: number) => {
    const discount = discounts[id] ?? 0;
    if (discount < 0 || discount > 100) {
      toast.error("Lütfen 0 ile 100 arasında geçerli bir indirim yüzdesi girin!");
      return;
    }

    try {
      await requests.Admin.updateDiscount(id, discount);
      toast.success(discount === 0 ? "İndirim kaldırıldı!" : `%${discount} indirim uygulandı!`);
      loadProducts();
    } catch {
      toast.error("İndirim güncellenemedi!");
    }
  };

  return (
    <TableContainer component={Box}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold", width: 80 }}>Ürün</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Ad</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Fiyat</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">Stok</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Açıklama</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kategori</TableCell>
            <TableCell sx={{ fontWeight: "bold", width: 180 }}>İndirim (%)</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">İşlemler</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              {/* ÜRÜN RESMİ */}
              <TableCell>
                <Avatar
                  variant="rounded"
                  src={`http://localhost:5198${product.images?.[0]?.imageUrl || product.imageUrl}`}
                  sx={{ width: 48, height: 48, border: "1px solid #eee" }}
                />
              </TableCell>

              {/* AD VE ID */}
              <TableCell>
                <Typography variant="body2" fontWeight="600">{product.name}</Typography>
                <Typography variant="caption" color="text.secondary">ID: #{product.id}</Typography>
              </TableCell>

              {/* FİYAT */}
              <TableCell sx={{ fontWeight: "600" }}>₺{product.price.toLocaleString("tr-TR")}</TableCell>

              {/* STOK ETİKETİ */}
             <TableCell align="center">
               <Chip
                  label={product.stock ?? 0}
                  size="small"
                  variant="tonal"
                  color={(product.stock ?? 0) <= 0 ? "error" : (product.stock ?? 0) < 10 ? "warning" : "success"}
                  sx={{ fontWeight: "bold", minWidth: 40 }}
                />
              </TableCell>

              {/* AÇIKLAMA (Tooltip ile) */}
              <TableCell sx={{ maxWidth: 200 }}>
                <Tooltip title={product.description}>
                  <Typography variant="body2" noWrap color="text.secondary">
                    {product.description}
                  </Typography>
                </Tooltip>
              </TableCell>

              <TableCell>
                <Chip label={product.subCategory?.name || "Belirtilmemiş"} size="small" sx={{ borderRadius: 1 }} />
              </TableCell>

              {/* İNDİRİM GÜNCELLEME */}
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    size="small"
                    type="number"
                    value={discounts[product.id] !== undefined ? discounts[product.id] : product.discount ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDiscounts((prev) => ({
                        ...prev,
                        [product.id]: val === "" ? undefined : Number(val),
                      }));
                    }}
                    sx={{
                      width: 70,
                      "& .MuiOutlinedInput-root": { fontSize: "0.85rem" }
                    }}
                  />
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => handleUpdateDiscount(product.id)}
                    sx={{ bgcolor: "#f0f7ff", "&:hover": { bgcolor: "#e0efff" } }}
                  >
                    <Save fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>

              {/* AKSİYON BUTONLARI */}
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title="Düzenle">
                    <IconButton 
                      size="small" 
                      onClick={() => onEdit(product)}
                      sx={{ color: "text.primary", border: "1px solid #ddd" }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(product.id)}
                      sx={{ border: "1px solid #ffcdd2" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}