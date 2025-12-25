import { Box } from "@mui/material";
import { useRef, useState } from "react";
import {IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  images: string[];
  onZoomImageChange: (img: string | null, pos: { x: number; y: number }) => void;
}

export default function ProductImageSlider({ images, onZoomImageChange }: Props) {
  const [index, setIndex] = useState(0);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const lensSize = 180;

  const nextImage=()=>{
    const newIndex= index===images.length-1 ? 0: index+1;
    setIndex(newIndex);
    onZoomImageChange(images[newIndex],lensPos);
  }
   const prevImage = () => {
    const newIndex = index === 0 ? images.length - 1 : index - 1;
    setIndex(newIndex);
    onZoomImageChange(images[newIndex], lensPos);
  };

  const handleMove = (e: any) => {
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    let x = e.clientX - rect.left - lensSize / 2;
    let y = e.clientY - rect.top - lensSize / 2;

    if (x < 0) x = 0;
    if (x > rect.width - lensSize) x = rect.width - lensSize;
    if (y < 0) y = 0;
    if (y > rect.height - lensSize) y = rect.height - lensSize;

    const pos = { x, y };

    setLensPos(pos);
    onZoomImageChange(images[index], pos);
  };

  return (
    <Box sx={{ position: "relative", width: 500 }}>
      <Box
        sx={{
          width: "100%",
          height: 500,
          overflow: "hidden",
          position: "relative",
          cursor: "zoom-in",
        }}
        onMouseEnter={() => {
          setShowLens(true);
          onZoomImageChange(images[index], lensPos); 
        }}
        onMouseLeave={() => {
          setShowLens(false);
          onZoomImageChange(null, { x: 0, y: 0 }); 
        }}
        onMouseMove={handleMove}
      >
        <img
          ref={imgRef}
          src={images[index]}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />

        {showLens && (
          <Box
            sx={{
              position: "absolute",
              left: lensPos.x,
              top: lensPos.y,
              width: lensSize,
              height: lensSize,
              border: "2px solid black",
              background: "rgba(255,255,255,.1)",
              pointerEvents: "none",
            }}
          />
        )}

        <IconButton
          onClick={prevImage}
          sx={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.8)",
            zIndex: 10,
            "&:hover": { background: "white" },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton
          onClick={nextImage}
          sx={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.8)",
            zIndex: 10,
            "&:hover": { background: "white" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            style={{
              width: 60,
              height: 60,
              border: index === i ? "3px solid black" : "1px solid #ccc",
              cursor: "pointer",
            }}
            onClick={() => setIndex(i)}
          />
        ))}
      </Box>
    </Box>
  );
}
