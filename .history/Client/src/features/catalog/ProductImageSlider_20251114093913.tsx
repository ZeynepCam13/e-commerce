import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  images: string[];
}

export default function ProductImageSlider({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const prev = () => {
    triggerFade(() => {
      setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    });
  };

  const next = () => {
    triggerFade(() => {
      setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    });
  };

  const triggerFade = (change: () => void) => {
    setFade(true);
    setTimeout(() => {
      change();
      setFade(false);
    }, 200);
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Büyük Resim */}
      <Box
        sx={{
          width: "100%",
          height: 500,
          borderRadius: 2,
          overflow: "hidden", // tasarım için gerekli
          position: "relative",
          background: "#f7f7f7",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={images[index]}
          className="big-img"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: fade ? 0 : 1,
            transition: fade
              ? "opacity 0.2s ease-out"
              : "opacity 0.4s ease-in, transform 0.4s ease",
          }}
        />

        {/* Zoom CSS */}
        <style>
          {`
            .big-img:hover {
              transform: scale(1.15); /* Zoom düzeltildi */
            }
          `}
        </style>

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
            onClick={() => triggerFade(() => setIndex(i))}
            sx={{
              width: 70,
              height: 70,
              borderRadius: 1,
              overflow: "hidden",
              cursor: "pointer",
              border: index === i ? "3px solid black" : "1px solid #ccc",
              transition: "border-color 0.2s ease",
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
