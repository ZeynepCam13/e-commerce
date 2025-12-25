import { Person } from "@mui/icons-material";
import { Avatar, Box, Checkbox, Container, FormControlLabel, Paper, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { loginUser } from "./accountSlice";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getCart } from "../cart/cartSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.account);

  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // **Giriş işlemi tamamlandığında çalışacak**
  useEffect(() => {
    if (user) {
      // 🔥 REMEMBER ME — Token kaydetme
      if (rememberMe) {
        localStorage.setItem("token", user.token);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", user.token);
        localStorage.removeItem("token");
      }

      // Hoş geldin bildirimi
      toast.success(`Hoş geldin, ${user.name}!`, {
        position: "top-right",
        autoClose: 2500,
        style: {
          backgroundColor: "#fff",
          color: "#111",
          borderRadius: "8px",
          border: "1px solid #eee",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        },
      });

      // Admin ise admin paneline yönlendir
      if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/catalog");
      }
    }
  }, [user, navigate]);

  // **Form gönderildiğinde**
  async function submitForm(data: FieldValues) {
    await dispatch(loginUser(data));
    await dispatch(getCart());
  }

  return (
    <Container maxWidth="xs">
      <Paper
        sx={{
          marginTop: 8,
          padding: 2,
          background:
            "linear-gradient(145deg, rgba(250,250,250,1) 0%, rgba(245, 245, 246, 0.91) 100%)",
        }}
        elevation={3}
      >
        <Avatar sx={{ mx: "auto", textAlign: "center", mb: 1 }}>
          <Person />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Giriş Yap
        </Typography>

        <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 2 }}>
          <TextField
            {...register("username", { required: "kullanıcı adı boş geçilemez" })}
            label="Kullanıcı Adı Giriniz"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            size="small"
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            {...register("password", {
              required: "şifre boş bırakılamaz",
              minLength: {
                value: 6,
                message: "en az 6 karakter giriniz",
              },
            })}
            label="Şifre Giriniz"
            type="password"
            fullWidth
            required
            sx={{ mb: 2 }}
            size="small"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {/* Remember Me + Şifremi Unuttum */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 1 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: "#111",
                    "&.Mui-checked": { color: "#111" },
                  }}
                />
              }
              label="Beni Hatırla"
            />

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline", color: "primary.main" },
              }}
              onClick={() => navigate("/forgotpassword")}
            >
              Şifremi Unuttum
            </Typography>
          </Box>

          <LoadingButton
            loading={isSubmitting}
            disabled={!isValid}
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
          >
            Giriş Yap
          </LoadingButton>
        </Box>
      </Paper>
    </Container>
  );
}
