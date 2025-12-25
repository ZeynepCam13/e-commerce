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
} from "@mui/material";
import { toast } from "react-toastify";
import requests from "../../api/requests";
import { IProduct } from "../../model/IProduct";

interface Props {
  onEdit: (product: IProduct) => void;
}

export default function ProductTable({ onEdit }: Props) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [discounts, setDiscounts] = useState<
    Record<number, number | undefined>
  >({});

  const loadProducts = async () => {
    try {
      // 🔥 ADMIN endpoint
      const data = await requests.Catalog.list();
      setProducts(data);
    } catch {
      toast.error("Ürünler yüklenemedi");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bu ürünü silmek istediğine emin misin?")) return;

    try {
      await requests.Admin.deleteProduct(id);
      toast.success("Ürün silindi");
      loadProducts();
    } catch {
      toast.error("Silme işlemi başarısız");
    }
  };

  const handleUpdateDiscount = async (id: number) => {
    const discount = discounts[id] ?? 0;

    if (discount < 0 || discount > 100) {
      toast.error("0–100 arası indirim giriniz");
      return;
    }

    try {
      await requests.Admin.updateDiscount(id, discount);
      toast.success(
        discount === 0
          ? "İndirim kaldırıldı"
          : `%${discount} indirim uygulandı`
      );
      loadProducts();
    } catch {
      toast.error("İndirim güncellenemedi");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ürün Listesi
      </Typography>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#111" }}>
            <TableCell sx={{ color: "white" }}>ID</TableCell>
            <TableCell sx={{ color: "white" }}>Ad</TableCell>
            <TableCell sx={{ color: "white" }}>Fiyat</TableCell>
            <TableCell sx={{ color: "white" }}>Stok</TableCell>
            <TableCell sx={{ color: "white" }}>Açıklama</TableCell>
            <TableCell sx={{ color: "white" }}>Kategori</TableCell>
            <TableCell sx={{ color: "white" }}>İndirim (%)</TableCell>
            <TableCell sx={{ color: "white" }}>İşlemler</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>₺{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.category?.name ?? "-"}</TableCell>

              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    size="small"
                    type="number"
                    value={
                      discounts[product.id] !== undefined
                        ? discounts[product.id]
                        : product.discount ?? ""
                    }
                    onChange={(e) =>
                      setDiscounts((prev) => ({
                        ...prev,
                        [product.id]:
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                      }))
                    }
                    sx={{ width: 80 }}
                    inputProps={{ min: 0, max: 100 }}
                  />

                  <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: "#111", "&:hover": { bgcolor: "#333" } }}
                    onClick={() => handleUpdateDiscount(product.id)}
                  >
                    Kaydet
                  </Button>
                </Box>
              </TableCell>

              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onEdit(product)}
                  sx={{ mr: 1 }}
                >
                  Düzenle
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(product.id)}
                >
                  Sil
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                Henüz ürün yok
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
