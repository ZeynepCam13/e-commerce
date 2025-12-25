import { Person, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { 
  Avatar, Box, Checkbox, Container, FormControlLabel, Paper, 
  TextField, Typography, InputAdornment, IconButton, Stack 
} from "@mui/material";
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
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm({
    mode: "onTouched", // Hataları kullanıcı yazarken gösterir
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      toast.success(`Tekrar hoş geldin, ${user.name}!`, {
        position: "top-right",
        autoClose: 2000,
      });

      if (user.role === "Admin") navigate("/admin");
      else navigate("/catalog");
    }
  }, [user, navigate]);

  async function submitForm(data: FieldValues) {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      if (result.token) {
        if (rememberMe) {
          localStorage.setItem("token", result.token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", result.token);
          localStorage.removeItem("token");
        }
      }
      await dispatch(getCart());
    } catch (error) {
      // Hataları accountSlice içinde handle ettiğinizi varsayıyorum
    }
  }

  return (
    <Container maxWidth="xs" sx={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          padding: 4,
          borderRadius: 4,
          border: "1px solid #f0f0f0",
          boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
          width: '100%',
          background: "#fff",
        }}
      >
        <Stack alignItems="center" spacing={1} mb={3}>
          <Avatar sx={{ bgcolor: "black", width: 56, height: 56 }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>
            Giriş Yap
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Devam etmek için hesabınıza erişin
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate>
          <TextField
            {...register("username", { required: "Kullanıcı adı gerekli" })}
            label="Kullanıcı Adı"
            fullWidth
            margin="normal"
            autoComplete="username"
            error={!!errors.username}
            helperText={errors.username?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            {...register("password", {
              required: "Şifre gerekli",
              minLength: { value: 6, message: "En az 6 karakter" },
            })}
            label="Şifre"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="default"
                />
              }
              label={<Typography variant="body2">Beni Hatırla</Typography>}
            />
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/forgotpassword")}
            >
              Şifremi Unuttum?
            </Typography>
          </Stack>

          <LoadingButton
            loading={isSubmitting}
            disabled={!isValid}
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              mt: 2, 
              py: 1.5, 
              borderRadius: 2, 
              bgcolor: "black",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#333" }
            }}
          >
            Giriş Yap
          </LoadingButton>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}>
            Hesabınız yok mu? {" "}
            <Typography 
              component="span" 
              variant="body2" 
              fontWeight="bold" 
              sx={{ cursor: 'pointer', color: 'black', '&:hover': { textDecoration: 'underline' } }}
              onClick={() => navigate("/register")}
            >
              Üye Olun
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}