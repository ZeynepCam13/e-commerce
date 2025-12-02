import { Box, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  images: string[];
}

export default function ProductImageSlider({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const zoomLevel = 2.2; // Zoom seviyesi (istersen artırabiliriz)

  const prev = () => triggerFade(() => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)));
  const next = () => triggerFade(() => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)));

  const triggerFade = (change: () => void) => {
    setFade(true);
    setTimeout(() => {
      change();
      setFade(false);
    }, 200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;

    setLensPos({ x, y });
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Büyük Resim + LENS ZOOM KUTUSU */}
      <Box
        sx={{
          width: "100%",
          height: 500,
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          background: "#f7f7f7",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          cursor: "zoom-in",
        }}
        onMouseEnter={() => setShowLens(true)}
        onMouseLeave={() => setShowLens(false)}
        onMouseMove={handleMouseMove}
      >
        {/* ANA RESİM */}
        <img
          ref={imgRef}
          src={images[index]}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: fade ? 0 : 1,
            transition: fade
              ? "opacity .2s ease-out"
              : "opacity .4s ease-in",
          }}
        />

        {/* LENS (Zoom yapılan yer) */}
        {showLens && (
          <Box
            sx={{
              width: 150,
              height: 150,
              position: "absolute",
              pointerEvents: "none",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid white",
              boxShadow: "0 0 6px rgba(0,0,0,0.2)",
              transform: "translate(-50%, -50%)",
              left: lensPos.x,
              top: lensPos.y,
              zIndex: 10,
            }}
          >
            <img
              src={images[index]}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoomLevel}) translate(${
                  (-lensPos.x / imgRef.current!.clientWidth) * 100
                }%, ${
                  (-lensPos.y / imgRef.current!.clientHeight) * 100
                }%)`,
                transformOrigin: "top left",
                objectFit: "contain",
              }}
            />
          </Box>
        )}

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

      {/* Thumbnail Bölümü */}
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
              transition: "0.2s",
            }}
          >
            <img
              src={img}
              alt=""
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
