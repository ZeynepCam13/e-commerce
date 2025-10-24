import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import { useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    fullName: "Zeynep Çam",
    email: "zeynep@example.com",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Yeni bilgiler:", form);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 8,
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
        }}
      >
        <Stack alignItems="center" spacing={2} mb={3}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
            {form.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Hesap Ayarları
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bilgilerini güncelle veya şifreni değiştir
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Ad Soyad"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="E-posta"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Yeni Şifre"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              Kaydet
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
