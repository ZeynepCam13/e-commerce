import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Zeynep Çam",
    email: "zeynep@example.com",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    console.log("Profil bilgileri kaydedildi:", profile);
  };

  const handleSavePassword = () => {
    if (passwords.newPass !== passwords.confirm) {
      alert("Yeni şifreler uyuşmuyor!");
      return;
    }
    console.log("Şifre güncellendi:", passwords);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        mt:0,
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: 900,
          background:
            "linear-gradient(145deg, rgba(250,250,250,1) 0%, rgba(193, 193, 195, 1) 100%)",
        }}
      >
        
        <Stack alignItems="center" mb={4}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "primary.main",
              fontSize: 36,
              fontWeight: 500,
            }}
          >
            {profile.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" mt={2}>
            Hesap Ayarları
          </Typography>
          <Typography color="text.secondary" fontSize="0.9rem">
            Profil bilgilerini ve şifreni yönet
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // responsive
            gap: 3,
          }}
        >
         
          <Box
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 3,
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" mb={2}>
              Kişisel Bilgiler
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Ad Soyad"
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                fullWidth
              />
              <TextField
                label="E-posta"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                fullWidth
              />
              <Button
                onClick={handleSaveProfile}
                variant="contained"
                sx={{
                  alignSelf: "flex-end",
                  width: "fit-content",
                  px: 3,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Kaydet
              </Button>
            </Stack>
          </Box>

          
          <Box
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 3,
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" mb={2}>
              Şifre Güncelleme
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Mevcut Şifre"
                name="current"
                type="password"
                value={passwords.current}
                onChange={handlePasswordChange}
                fullWidth
              />
              <TextField
                label="Yeni Şifre"
                name="newPass"
                type="password"
                value={passwords.newPass}
                onChange={handlePasswordChange}
                fullWidth
              />
              <TextField
                label="Yeni Şifre (Tekrar)"
                name="confirm"
                type="password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                fullWidth
              />
              <Button
                onClick={handleSavePassword}
                variant="outlined"
                color="secondary"
                sx={{
                  alignSelf: "flex-end",
                  width: "fit-content",
                  px: 3,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Şifreyi Güncelle
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
