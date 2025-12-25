import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router";

export default function VerifyEmail() {

  const [code, setCode] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email");

  const handleVerify = async () => {
    try {
      await axios.post("http://localhost:5198/api/account/verify-email", {
        email: email,
        code: code
      });

      toast.success("E-posta doğrulama başarılı!");
      navigate("/login");

    } catch (error: any) {
      toast.error(error.response?.data?.title || "Kod yanlış veya süresi dolmuş!");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
      <Typography variant="h5" mb={3}>
        E-posta Doğrulama
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
      >
        Doğrula
      </Button>
    </Box>
  );
}
