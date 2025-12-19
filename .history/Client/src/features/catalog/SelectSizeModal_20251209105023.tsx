import { Modal, Box, Button } from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  product: any;
  onConfirm: (size: string) => void;
}

export default function SelectSizeModal({ open, onClose, product, onConfirm }: Props) {
  const [selectedSize, setSelectedSize] = useState("");

  const sizes = product?.sizes || ["S", "M", "L", "XL"];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 350,
          bgcolor: "white",
          p: 3,
          m: "150px auto",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>{product?.name}</h3>

        <p>Beden Seçiniz:</p>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", my: 2 }}>
          {sizes.map((size:string) => (
            <Button
              key={size}
              variant={selectedSize === size ? "contained" : "outlined"}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </Button>
          ))}
        </Box>

        <Button
          variant="contained"
          color="primary"
          disabled={!selectedSize}
          onClick={() => {
            onConfirm(selectedSize);
            onClose();
          }}
        >
          Sepete Ekle
        </Button>
      </Box>
    </Modal>
  );
}
