import { useState } from "react";
import { Container, Typography, TextField, Button, Divider, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

export default function SettingsPage() {
  // Profil
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Şifre
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const saveProfile = async () => {
    try {
      await axios.put("http://localhost:5198/api/Account/update-profile", {
        name,
        phone,
      });
      toast.success("Bilgiler güncellendi!");
    } catch {
      toast.error("Bir hata oluştu");
    }
  };

 

  const changePassword = async () => {
    if (newPass !== confirmPass) {
      toast.error("Yeni şifreler eşleşmiyor!");
      return;
    }

    try {
      await axios.post("http://localhost:5198/api/Account/change-password", {
        oldPassword: oldPass,
        newPassword: newPass,
      });
      toast.success("Şifre başarıyla güncellendi!");
    } catch {
      toast.error("Mevcut şifre hatalı!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Ayarlar
      </Typography>

      {/* PROFİL */}
      <Typography variant="h6">Profil Bilgileri</Typography>
      <TextField label="İsim Soyisim" fullWidth sx={{ mt: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Telefon" fullWidth sx={{ mt: 2 }} value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={saveProfile}>
        Kaydet
      </Button>

      <Divider sx={{ my: 4 }} />


      {/* ŞİFRE */}
      <Typography variant="h6">Şifre Değiştir</Typography>
      <TextField label="Mevcut Şifre" type="password" fullWidth sx={{ mt: 2 }} value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
      <TextField label="Yeni Şifre" type="password" fullWidth sx={{ mt: 2 }} value={newPass} onChange={(e) => setNewPass(e.target.value)} />
      <TextField label="Yeni Şifre Tekrar" type="password" fullWidth sx={{ mt: 2 }} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />

      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={changePassword}>
        Şifreyi Güncelle
      </Button>
    </Container>
  );
}
