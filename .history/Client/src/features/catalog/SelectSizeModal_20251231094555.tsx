import { Modal, Box, Button, Typography, Stack } from "@mui/material";
import { useState } from "react";

interface ProductSize {
  id: number;
  size: string;
  stock: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    productSizes: ProductSize[];
  };
  onConfirm: (size: string) => void;
}

export default function SelectSizeModal({
  open,
  onClose,
  product,
  onConfirm,
}: Props) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const sizes = product?.productSizes || [];

  const selectedSizeStock =
    sizes.find((s) => s.size === selectedSize)?.stock ?? null;

  const isOutOfStock = selectedSizeStock === 0 && selectedSize !== "";
  const isCriticalStock =
    selectedSizeStock !== null &&
    selectedSizeStock > 0 &&
    selectedSizeStock < 10;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 360,
          bgcolor: "white",
          p: 3,
          m: "120px auto",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={1}>
          {product?.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Lütfen beden seçiniz
        </Typography>

        {/* BEDENLER */}
        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="center"
          flexWrap="wrap"
          mb={2}
        >
          {sizes.map((ps) => (
            <Button
              key={ps.id}
              variant={selectedSize === ps.size ? "contained" : "outlined"}
              disabled={ps.stock === 0}
              onClick={() => setSelectedSize(ps.size)}
              sx={{
                minWidth: 56,
                height: 42,
                borderRadius: 1,
                opacity: ps.stock === 0 ? 0.4 : 1,
                cursor: ps.stock === 0 ? "not-allowed" : "pointer",
                bgcolor:
                  selectedSize === ps.size ? "black" : "transparent",
                color:
                  selectedSize === ps.size ? "white" : "text.primary",
                borderColor: "black",
                "&:hover": {
                  bgcolor:
                    selectedSize === ps.size ? "black" : "#f5f5f5",
                },
              }}
            >
              {ps.size}
            </Button>
          ))}
        </Stack>

        {/* STOK MESAJI – SADECE BEDEN SEÇİLİNCE */}
        {selectedSize && isOutOfStock && (
          <Box
            sx={{
              mb: 2,
              p: 1,
              borderRadius: 1,
              bgcolor: "#fdecea",
              border: "1px solid #f5c2c7",
            }}
          >
            <Typography fontSize="0.85rem" fontWeight={600} color="error.main">
              Seçtiğiniz beden tükenmiştir.
            </Typography>
          </Box>
        )}

        {selectedSize && isCriticalStock && (
          <Box
            sx={{
              mb: 2,
              p: 1,
              borderRadius: 1,
              bgcolor: "#fff8e1",
              border: "1px solid #ffecb5",
            }}
          >
            <Typography
              fontSize="0.85rem"
              fontWeight={600}
              color="#b26a00"
            >
              Seçtiğiniz bedenden son {selectedSizeStock} adet kaldı.
            </Typography>
          </Box>
        )}

        {/* SEPETE EKLE */}
        <Button
          fullWidth
          variant="contained"
          disabled={!selectedSize || isOutOfStock}
          sx={{
            mt: 1,
            bgcolor: "black",
            "&:hover": { bgcolor: "#333" },
          }}
          onClick={() => {
            onConfirm(selectedSize);
            setSelectedSize("");
            onClose();
          }}
        >
          {isOutOfStock ? "TÜKENDİ" : "SEPETE EKLE"}
        </Button>
      </Box>
    </Modal>
  );
}
