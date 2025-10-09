import { Box, Container, Grid, Typography, Button, Card, CardMedia, CardContent } from "@mui/material";

export default function HomePage() {
  return (
    <Box sx={{ backgroundColor: "#faf9f7", py: 8 }}>
      <Container maxWidth="lg">
        {/* Başlık */}
        <Typography
          variant="h2"
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

        {/* Açıklama */}
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
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe voluptas ut doloremque
          consequuntur, adipisci repellat eveniet. Voluptatem explicabo harum, quibusdam ex repellat eaque!
        </Typography>

        {/* Ürün kartları */}
        <Grid container spacing={4}>
          {[
            {
              id: 1,
              img: "https://images.unsplash.com/photo-1520975922131-dc1c5f2f8a32?auto=format&fit=crop&w=800&q=80",
              title: "Classic Beige Coat",
            },
            {
              id: 2,
              img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
              title: "Urban Streetwear",
            },
            {
              id: 3,
              img: "https://images.unsplash.com/photo-1520974735194-975c3d8cb832?auto=format&fit=crop&w=800&q=80",
              title: "Casual Comfort",
            },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  boxShadow: "none",
                  borderRadius: 0,
                  transition: "0.3s",
                  "&:hover": { boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={item.img}
                  alt={item.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ textAlign: "center", mt: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Poppins","sans-serif"',
                      fontWeight: 500,
                      color: "#222",
                    }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Keşfet butonu */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="outlined"
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
