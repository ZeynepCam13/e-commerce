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
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profil güncellendi:", form);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Yeni şifreler eşleşmiyor!");
      return;
    }

    console.log("Şifre güncellendi:", passwordForm);
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
        {/* Avatar ve Başlık */}
        <Stack alignItems="center" spacing={2} mb={3}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
            {form.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Hesap Ayarları
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Profil bilgilerini ve şifreni güncelle
          </Typography>
        </Stack>

        {/* Profil Bilgileri */}
        <form onSubmit={handleSaveProfile}>
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

            <Button type="submit" variant="contained">
              Profili Kaydet
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 4 }} />

        {/* Şifre Güncelleme */}
        <Typography variant="h6" gutterBottom>
          Şifre Güncelleme
        </Typography>

        <form onSubmit={handleChangePassword}>
          <Stack spacing={2}>
            <TextField
              label="Mevcut Şifre"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
            />

            <TextField
              label="Yeni Şifre"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              fullWidth
            />

            <TextField
              label="Yeni Şifre (Tekrar)"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
            />

            <Button type="submit" variant="contained" color="secondary">
              Şifreyi Güncelle
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
