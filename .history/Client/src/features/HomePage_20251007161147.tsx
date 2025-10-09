import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useAppSelector } from "../store/store";
import { Link } from "react-router";

export default function HomePage() {
  const { entities: products } = useAppSelector((state) => state.catalog); // ürünler redux’tan
  const productList = Object.values(products);

  const sliderItems = [
    {
      img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80",
      title: "New Season Arrivals",
      subtitle: "Discover the latest trends and timeless classics",
    },
    {
      img: "/images/slide.jpg",
      title: "Elegant & Minimal",
      subtitle: "Where simplicity meets sophistication",
    },
    {
      img: "/images/side2.webp",
      title: "Everyday Essentials",
      subtitle: "Comfort and style for every occasion",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#faf9f7" }}>
      {/* SLIDER */}
      <Carousel
        indicators={false}
        navButtonsAlwaysVisible
        interval={4000}
        animation="fade"
        navButtonsProps={{
          style: {
            backgroundColor: "rgba(255,255,255,0.7)",
            color: "#000",
            borderRadius: 0,
          },
        }}
      >
        {sliderItems.map((item, i) => (
          <Box
            key={i}
            sx={{
              position: "relative",
              height: { xs: 300, md: 500 },
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.35)",
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                px: 3,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Playfair Display","serif"',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Poppins","sans-serif"',
                  fontWeight: 400,
                  mb: 3,
                }}
              >
                {item.subtitle}
              </Typography>
              <Button
                variant="outlined"
                component={Link}
                to="/catalog"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  borderRadius: 0,
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: "#000",
                  },
                }}
              >
                Shop Now
              </Button>
            </Box>
          </Box>
        ))}
      </Carousel>

      {/* NEW COLLECTIONS */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontFamily: '"Playfair Display","serif"',
            fontWeight: 600,
            mb: 2,
            color: "#111",
          }}
        >
          New Collections
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            maxWidth: "700px",
            mx: "auto",
            mb: 6,
            color: "#555",
            fontFamily: '"Poppins","sans-serif"',
          }}
        >
          Discover our latest arrivals — modern, minimal and timeless pieces designed for everyone.
        </Typography>

        <Grid container spacing={4}>
          {productList.slice(0, 6).map((product: any) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  boxShadow: "none",
                  borderRadius: 0,
                  transition: "0.3s",
                  "&:hover": { boxShadow: "0 6px 15px rgba(0,0,0,0.1)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={product.imageUrl}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Poppins","sans-serif"',
                      fontWeight: 500,
                      color: "#222",
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontWeight: 400,
                    }}
                  >
                    ₺{product.price.toLocaleString("tr-TR")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Buton */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="outlined"
            component={Link}
            to="/catalog"
            sx={{
              color: "#111",
              borderColor: "#111",
              borderRadius: 0,
              px: 4,
              py: 1.5,
              fontFamily: '"Poppins","sans-serif"',
              "&:hover": { backgroundColor: "#111", color: "#fff" },
            }}
          >
            Discover More
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
