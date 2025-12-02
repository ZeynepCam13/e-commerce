import { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const sendResetEmail = async () => {
    try {
      await axios.post("http://localhost:5000/api/account/forgot-password", {
        email,
      });
      toast.success("Şifre sıfırlama maili gönderildi!");
    } catch {
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 3, marginTop: 5 }}>
        <Typography variant="h5">Şifremi Unuttum</Typography>

        <TextField
          label="E-mail"
          fullWidth
          sx={{ mt: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={sendResetEmail}
        >
          Mail Gönder
        </Button>
      </Paper>
    </Container>
  );
}
