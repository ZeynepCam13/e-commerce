import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useAppSelector } from "../store/store";
import { Link } from "react-router";
import { ArrowRightAlt, LocalShipping, Replay, VerifiedUser } from "@mui/icons-material";

export default function HomePage() {
  const { entities: products } = useAppSelector((state) => state.catalog);
  const productList = Object.values(products);
  const theme = useTheme();

  const sliderItems = [
    {
      img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80",
      title: "YENİ SEZON",
      subtitle: "Trendlerin ötesinde zamansız parçalarla tarzınızı yansıtın.",
      color: "#fff"
    },
    {
      img: "/images/side3.jpg",
      title: "IŞILTINI KEŞFET",
      subtitle: "Kozmetik koleksiyonumuzla doğal güzelliğinizi ön plana çıkarın.",
      color: "#fff"
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#fff" }}>
      {/* 1. HERO SLIDER SECTION */}
      <Carousel
        indicators={true}
        navButtonsAlwaysVisible
        interval={6000}
        animation="fade"
        sx={{ mb: 0 }}
        indicatorContainerProps={{
            style: { position: 'absolute', bottom: '20px', zIndex: 5 }
        }}
      >
        {sliderItems.map((item, i) => (
          <Box
            key={i}
            sx={{
              position: "relative",
              height: { xs: "70vh", md: "85vh" },
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                background: "linear-gradient(to right, rgba(0,0,0,0.4), transparent)"
            }} />
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
              <Box sx={{ maxWidth: 600, color: item.color }}>
                <Typography variant="overline" sx={{ letterSpacing: 4, fontWeight: 700 }}>
                  SINIRLI SAYIDA
                </Typography>
                <Typography variant="h1" sx={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontWeight: 700, mb: 2,
                    fontSize: { xs: '2.5rem', md: '4.5rem' }
                }}>
                  {item.title}
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
                  {item.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/catalog"
                  sx={{
                    bgcolor: "#fff", color: "#000", borderRadius: 0, px: 6, py: 2,
                    "&:hover": { bgcolor: "#eee" }, fontWeight: 600
                  }}
                >
                  ŞİMDİ KEŞFET
                </Button>
              </Box>
            </Container>
          </Box>
        ))}
      </Carousel>

      {/* 2. SERVICES BAR */}
      <Box sx={{ borderBottom: '1px solid #eee', py: 4, bgcolor: '#fafafa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {[
              { icon: <LocalShipping />, text: "Hızlı Teslimat" },
              { icon: <Replay />, text: "30 Gün İade" },
              { icon: <VerifiedUser />, text: "Güvenli Ödeme" }
            ].map((service, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  {service.icon}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                    {service.text.toUpperCase()}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
    </Box>
  );
}