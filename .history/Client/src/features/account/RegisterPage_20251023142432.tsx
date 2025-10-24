import { LockOutlined, Person2Rounded } from "@mui/icons-material";
import { Avatar, Box, Container, Paper, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router";
import requests from "../../api/requests";
import { toast } from "react-toastify";

export default function RegisterPage()
{

    const navigate = useNavigate();

    const {register, handleSubmit,setError, formState: {errors, isSubmitting, isValid} } = useForm({
        defaultValues: {
            username: "",
            password: "",
            name:"",
            email:""
        },
        mode:"onTouched"
    });

    async function submitForm(data: FieldValues) {
        requests.Account.register(data)
            .then(()=>{
                toast.success("kayıt başarılı");
                navigate("/login")
        }).catch(result =>{
            const {data:errors}=result;

            errors.forEach((error:any)=> {
                if(error.code=="DuplicateName"){
                    setError("name",{message: error.description})
                }
                else if(error.code=="DuplicateEmail"){
                    setError("email",{message: error.description})
                }
                else if(error.code=="DuplicatePassword"){
                    setError("password",{message: error.description})
                }
                else if(error.code=="DuplicateUserName"){
                    setError("username",{message: error.description})
                }

            });
            
            
                
            
        });
    }
    
    return (
        <Container maxWidth="xs">
            <Paper sx={{marginTop: 8, padding: 2,background:
            "linear-gradient(145deg, rgba(250,250,250,1) 0%, rgba(255, 250, 250, 0.91) 100%)"}} elevation={3}>
                <Avatar sx={{ mx: "auto", color: "secondary.main", textAlign: "center", mb: 1}}>
                    <Person2Rounded />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{textAlign: "center"}}>Üye Ol</Typography>
                <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{mt: 2}}>
                    <TextField 
                        {...register("name", {required: "isim boş geçilemez"})}
                        label="İsim Giriniz" 
                        fullWidth 
                        sx={{mb: 2}} 
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name?.message}></TextField>
                    
                    
                    <TextField 
                        {...register("password", {required: "şifre boş geçilemez", minLength: {
                            value: 6,
                            message: "Şifre en az 6 karakterli olmalıdır"
                        }})}
                        label="Şifre Giriniz" 
                        type="password" 
                        fullWidth 
                        sx={{mb: 2}} 
                        size="small"
                        error={!!errors.password}
                        helperText={errors.password?.message}></TextField>

                        <TextField 
                        {...register("email", {
                            required: "email boş geçilemez",
                            pattern:{
                                value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message:"email is not valid"
                            }
                        })}
                        label="E-mail Giriniz" 
                        fullWidth
                        sx={{mb: 2}} 
                        size="small"
                        error={!!errors.email}
                        helperText={errors.email?.message}></TextField>

                        <TextField 
                        {...register("username", {required: "kullanıcı adı boş geçilemez"})}
                        label="Kullanıcı Adı  Giriniz" 
                        fullWidth 
                        sx={{mb: 2}} 
                        size="small"
                        error={!!errors.username}
                        helperText={errors.username?.message}></TextField>
                    <LoadingButton 
                        loading={isSubmitting} 
                        disabled={!isValid}
                        type="submit" 
                        variant="contained" 
                        fullWidth sx={{mt: 1}}>Üye ol</LoadingButton>
                </Box>
            </Paper>
        </Container>
    );
}