import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  images: string[];
}

export default function ProductImageSlider({ images }: Props) {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Büyük Resim */}
      <Box
        sx={{
          width: "100%",
          height: 500,
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={images[index]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            background: "#f7f7f7",
          }}
        />

        {/* Sol Ok */}
        <IconButton
          onClick={prev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
            background: "white",
            "&:hover": { background: "#f0f0f0" },
          }}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>

        {/* Sağ Ok */}
        <IconButton
          onClick={next}
          sx={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            background: "white",
            "&:hover": { background: "#f0f0f0" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Thumbnail'lar */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mt: 2,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {images.map((img, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: 70,
              height: 70,
              borderRadius: 1,
              overflow: "hidden",
              cursor: "pointer",
              border: index === i ? "3px solid black" : "1px solid #ccc",
            }}
          >
            <img
              src={img}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
