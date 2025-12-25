import { PersonAddOutlined, BadgeOutlined, EmailOutlined, PhoneOutlined, LockOutlined } from "@mui/icons-material";
import { 
  Avatar, Box, Container, Paper, TextField, Typography, 
  RadioGroup, FormControlLabel, Radio, FormLabel, Grid, Stack, InputAdornment 
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router";
import requests from "../../api/requests";
import { toast } from "react-toastify";

export default function RegisterPage() {
    const navigate = useNavigate();

    const {register, handleSubmit, setError, formState: {errors, isSubmitting, isValid}} = useForm({
        defaultValues: {
            username: "",
            password: "",
            name: "",
            email: "",
            phone: "",
            verifyMethod: "email"
        },
        mode: "onTouched"
    });

    async function submitForm(data: FieldValues) {
        try {
            await requests.Account.register(data);
            toast.success("Kayıt başarılı!");
            if (data.verifyMethod === "sms") {
                navigate(`/verify-sms-page?phone=${data.phone.trim()}`);
            } else {
                navigate(`/verify-email?email=${data.email.trim()}`);
            }
        } catch (error: any) {
            const serverErrors = error.data;
            serverErrors?.forEach((err: any) => {
                if (err.code === "DuplicateName") setError("name", { message: err.description });
                else if (err.code === "DuplicateEmail") setError("email", { message: err.description });
                else if (err.code === "DuplicateUserName") setError("username", { message: err.description });
            });
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8, display: 'flex', alignItems: 'center' }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    borderRadius: 4, 
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                    width: '100%' 
                }}
            >
                <Stack alignItems="center" spacing={1} mb={4}>
                    <Avatar sx={{ bgcolor: "black", width: 56, height: 56 }}>
                        <PersonAddOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>
                        Yeni Hesap Oluştur
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Aramıza katılmak için formu doldurun
                    </Typography>
                </Stack>

                <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate>
                    <Grid container spacing={2}>
                        {/* İsim ve Kullanıcı Adı yan yana */}
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                {...register("name", {required: "İsim gereklidir"})}
                                label="Tam İsim" 
                                fullWidth 
                                size="small"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><BadgeOutlined fontSize="small" /></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                {...register("username", {required: "Kullanıcı adı gereklidir"})}
                                label="Kullanıcı Adı" 
                                fullWidth 
                                size="small"
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PersonAddOutlined fontSize="small" /></InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                {...register("email", {
                                    required: "E-posta gereklidir",
                                    pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Geçersiz e-posta formatı" }
                                })}
                                label="E-posta Adresi" 
                                fullWidth
                                size="small"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><EmailOutlined fontSize="small" /></InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                {...register("phone", {required: "Telefon gereklidir"})}
                                label="Telefon Numarası" 
                                fullWidth 
                                size="small"
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PhoneOutlined fontSize="small" /></InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                {...register("password", {
                                    required: "Şifre gereklidir", 
                                    minLength: { value: 6, message: "Şifre en az 6 karakter olmalıdır" }
                                })}
                                label="Şifre" 
                                type="password" 
                                fullWidth 
                                size="small"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LockOutlined fontSize="small" /></InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ p: 2, bgcolor: '#fcfcfc', borderRadius: 2, border: '1px solid #f0f0f0' }}>
                                <FormLabel sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'black', mb: 1, display: 'block' }}>
                                    Doğrulama Yöntemi
                                </FormLabel>
                                <RadioGroup row defaultValue="email" sx={{ justifyContent: 'space-around' }}>
                                    <FormControlLabel 
                                        {...register("verifyMethod")}
                                        value="email" 
                                        control={<Radio size="small" color="default" />} 
                                        label={<Typography variant="body2">E-posta</Typography>} 
                                    />
                                    <FormControlLabel 
                                        {...register("verifyMethod")}
                                        value="sms" 
                                        control={<Radio size="small" color="default" />} 
                                        label={<Typography variant="body2">SMS</Typography>} 
                                    />
                                </RadioGroup>
                            </Box>
                        </Grid>
                    </Grid>

                    <LoadingButton 
                        loading={isSubmitting} 
                        disabled={!isValid}
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        size="large"
                        sx={{
                            mt: 4, 
                            py: 1.5, 
                            borderRadius: 2, 
                            bgcolor: "black",
                            fontWeight: "bold",
                            "&:hover": { bgcolor: "#333" }
                        }}
                    >
                        Hesap Oluştur
                    </LoadingButton>

                    <Typography variant="body2" sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}>
                        Zaten üye misiniz? {" "}
                        <Typography 
                            component="span" 
                            variant="body2" 
                            fontWeight="bold" 
                            sx={{ cursor: 'pointer', color: 'black', '&:hover': { textDecoration: 'underline' } }}
                            onClick={() => navigate("/login")}
                        >
                            Giriş Yapın
                        </Typography>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}