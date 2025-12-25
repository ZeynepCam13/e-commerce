import { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");

  const reset = async () => {
    try {
      await axios.post("http://localhost:5000/api/account/reset-password", {
        email,
        token,
        newPassword: password,
      });

      toast.success("Şifre başarıyla güncellendi!");
    } catch {
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 3, marginTop: 5 }}>
        <Typography variant="h5">Yeni Şifre Oluştur</Typography>

        <TextField
          label="Yeni Şifre"
          type="password"
          fullWidth
          sx={{ mt: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={reset}>
          Şifreyi Kaydet
        </Button>
      </Paper>
    </Container>
  );
}
