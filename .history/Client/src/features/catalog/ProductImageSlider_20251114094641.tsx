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

  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const lensSize = 200;
  const zoomLevel = 3; // daha net zoom

  const prev = () => {
    setFade(true);
    setTimeout(() => {
      setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
      setFade(false);
    }, 200);
  };

  const next = () => {
    setFade(true);
    setTimeout(() => {
      setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
      setFade(false);
    }, 200);
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

    setLensPos({ x, y });
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* SOL TARAFTA ANA RESİM + LENS */}
      <Box sx={{ position: "relative", width: 500 }}>
        <Box
          sx={{
            width: "100%",
            height: 500,
            overflow: "hidden",
            background: "#f7f7f7",
            borderRadius: 2,
            position: "relative",
            cursor: "zoom-in",
          }}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
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
              opacity: fade ? 0 : 1,
              transition: fade ? "opacity .2s" : "opacity .4s",
            }}
          />

          {/* KARE LENS */}
          {showZoom && (
            <Box
              sx={{
                position: "absolute",
                left: lensPos.x,
                top: lensPos.y,
                width: lensSize,
                height: lensSize,
                border: "2px solid #222",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(2px)",
                pointerEvents: "none",
                zIndex: 10,
              }}
            ></Box>
          )}

          {/* OKLAR */}
          <IconButton
            onClick={prev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              background: "#fff",
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>

          <IconButton
            onClick={next}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              background: "#fff",
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* Thumbnail */}
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          {images.map((img, i) => (
            <Box
              key={i}
              onClick={() => {
                setFade(true);
                setTimeout(() => {
                  setIndex(i);
                  setFade(false);
                }, 200);
              }}
              sx={{
                width: 60,
                height: 60,
                border: index === i ? "3px solid black" : "1px solid #ccc",
                borderRadius: 1,
                overflow: "hidden",
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

      {/* SAĞ TARAFTA BÜYÜK ZOOM PANELİ */}
      {showZoom && (
        <Box
          sx={{
            width: 500,
            height: 500,
            overflow: "hidden",
            borderRadius: 2,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: { xs: "none", md: "block" },
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
                scale(${zoomLevel})
                translate(
                  ${-(lensPos.x / imgRef.current!.clientWidth) * 100}%,
                  ${-(lensPos.y / imgRef.current!.clientHeight) * 100}%
                )
              `,
              transformOrigin: "top left",
            }}
          />
        </Box>
      )}
    </Box>
  );
}
