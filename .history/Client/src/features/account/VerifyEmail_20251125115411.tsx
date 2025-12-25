import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 dakika = 300 saniye
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email");

  // ⏳ Geri Sayım
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("Kodun süresi doldu! Lütfen yeniden üye olun.");
      navigate("/login");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🕒 Dakika & saniye hesaplama
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleVerify = async () => {
    try {
      await axios.post("http://localhost:5198/api/account/verify-email", {
        email: email,
        code: code, // code olmalı, otp değil
      });

      toast.success("E-posta doğrulama başarılı!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data || "Kod yanlış veya süresi dolmuş!");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10, textAlign: "center" }}>
      <Typography variant="h5" mb={3}>
        E-posta Doğrulama
      </Typography>

      <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold", color: "#d32f2f" }}>
        Kodun geçerlilik süresi: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </Typography>

      <TextField
        label="Doğrulama Kodu"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleVerify}
        disabled={timeLeft <= 0}
      >
        Doğrula
      </Button>
    </Box>
  );
}
