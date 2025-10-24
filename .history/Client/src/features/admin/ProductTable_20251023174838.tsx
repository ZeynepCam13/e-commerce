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
  const [discounts, setDiscounts] = useState<{ [key: number]: number }>({});

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

  const handleDiscountChange = (id: number, value: string) => {
    setDiscounts({ ...discounts, [id]: parseInt(value) });
  };

  const handleUpdateDiscount = async (id: number) => {
    const discount = discounts[id];
    if (isNaN(discount)) {
      toast.error("Lütfen geçerli bir indirim yüzdesi girin!");
      return;
    }

    try {
      await requests.Admin.updateDiscount(id, discount);
      toast.success(`%${discount} indirim uygulandı!`);
      loadProducts();
    } catch {
      toast.error("İndirim güncellenemedi!");
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
            <TableCell sx={{ color: "white" }}>Marka</TableCell>
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
              <TableCell>{product.category?.name}</TableCell>

              {/* 🔽 Yeni eklenen indirim alanı */}
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    size="small"
                    type="number"
                    value={product.discount?.toString() ?? ""}
                    onChange={(e) =>
                      handleDiscountChange(product.id,e.target.value)
                    }
                    sx={{ width: 80 }}
                    inputProps={{ min: 0, max: 100 }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: "#111",
                      "&:hover": { bgcolor: "#333" },
                      textTransform: "none",
                    }}
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
        </TableBody>
      </Table>
    </Box>
  );
}
