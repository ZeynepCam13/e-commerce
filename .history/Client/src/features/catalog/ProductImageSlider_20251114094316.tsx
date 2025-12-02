import { Box, IconButton } from "@mui/material";
import { useState, useRef } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  images: string[];
}

export default function ProductImageSlider({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // Trendyol tarzı kare lens zoom
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const lensSize = 200;      // lens kare boyutu (Trendyol ile aynı)
  const zoomLevel = 2.5;     // zoom seviyesi

  const handleMove = (e: any) => {
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();

    let x = e.clientX - rect.left - lensSize / 2;
    let y = e.clientY - rect.top - lensSize / 2;

    // Lens resim dışına çıkmasın
    if (x < 0) x = 0;
    if (x > rect.width - lensSize) x = rect.width - lensSize;
    if (y < 0) y = 0;
    if (y > rect.height - lensSize) y = rect.height - lensSize;

    setLensPos({ x, y });
  };

  const triggerFade = (callback: () => void) => {
    setFade(true);
    setTimeout(() => {
      callback();
      setFade(false);
    }, 200);
  };

  const prev = () =>
    triggerFade(() =>
      setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    );

  const next = () =>
    triggerFade(() =>
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    );

  return (
    <Box sx={{ width: "100%" }}>
      {/* ANA RESİM + LENS ZOOM */}
      <Box
        sx={{
          width: "100%",
          height: 500,
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          background: "#f7f7f7",
          cursor: "zoom-in",
        }}
        onMouseEnter={() => setShowLens(true)}
        onMouseLeave={() => setShowLens(false)}
        onMouseMove={handleMove}
      >
        <img
          ref={imgRef}
          src={images[index]}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: fade ? "opacity .2s" : "opacity .4s",
            opacity: fade ? 0 : 1,
          }}
        />

        {showLens && (
          <>
            {/* KARŞI TARAF (ZOOM İÇİN) TRENDYOL STİLİ */}
            <Box
              sx={{
                width: lensSize,
                height: lensSize,
                position: "absolute",
                left: lensPos.x,
                top: lensPos.y,
                border: "2px solid #000",
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 10,
                background: "#fff",
              }}
            >
              <img
                src={images[index]}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `
                    translate(-${lensPos.x}px, -${lensPos.y}px)
                    scale(${zoomLevel})
                  `,
                  transformOrigin: "top left",
                }}
              />
            </Box>
          </>
        )}

        {/* OKLAR */}
        <IconButton
          onClick={prev}
          sx={{
            position: "absolute",
            left: 10,
            top: "50%",
            background: "#fff",
          }}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>

        <IconButton
          onClick={next}
          sx={{
            position: "absolute",
            right: 10,
            top: "50%",
            background: "#fff",
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* THUMBNAIL */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
          mt: 2,
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
              border: index === i ? "3px solid black" : "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            <img
              src={img}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
