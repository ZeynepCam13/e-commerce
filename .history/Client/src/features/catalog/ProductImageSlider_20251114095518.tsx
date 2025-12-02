import { Box } from "@mui/material";
import { useRef, useState } from "react";

interface Props {
  images: string[];
  onZoomImageChange: (img: string, pos: {x:number, y:number}) => void;
}

export default function ProductImageSlider({ images, onZoomImageChange }: Props) {
  const [index, setIndex] = useState(0);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const lensSize = 180;

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

    setLensPos({ x, y });
    onZoomImageChange(images[index], {x, y});
  };

  return (
    <Box sx={{ position: "relative", width: "500px" }}>
      <Box
        sx={{ width: "100%", height: 500, overflow: "hidden", position: "relative", cursor: "zoom-in" }}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMove}
      >
        <img
          ref={imgRef}
          src={images[index]}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />

        {showZoom && (
          <Box
            sx={{
              position: "absolute",
              left: lensPos.x,
              top: lensPos.y,
              width: lensSize,
              height: lensSize,
              border: "2px solid black",
              pointerEvents: "none",
              background: "rgba(255,255,255,.1)",
            }}
          />
        )}
      </Box>

      {/* Thumbnail */}
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
