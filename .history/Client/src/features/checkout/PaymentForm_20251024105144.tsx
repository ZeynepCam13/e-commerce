import { Grid2, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import InputMask from "react-input-mask";


export default function PaymentForm()
{
    const { register, formState: {errors} } = useFormContext();
    return (
        <Grid2 container spacing={3}>

            <Grid2 size={{xs: 12, md: 6}}>
                 <TextField 
                    {...register("card_name", {required: "Card name is required"})}
                    label="Kart İsmi" 
                    fullWidth autoFocus 
                    sx={{mb: 2}} 
                    size="small"
                    error={!!errors.card_name}></TextField>
            </Grid2>

            <Grid2 size={{xs: 12 , md: 6}}>
                <InputMask
                mask="9999-9999-9999-9999"
                {...register("card_number",{required:"kart numarası boş geçilemez"})}
                >
                    {(inputProps:any)=>(
                    <TextField 
                    {...inputProps}
                    label="Kart Numarası" 
                    fullWidth 
                    sx={{mb: 2}} 
                    size="small"
                    error={!!errors.card_number}
                    />
                    )}
                </InputMask>
            </Grid2>

            <Grid2 size={{xs: 12 , md: 6}}>
                <InputMask
                mask="99/99"
                {...register("card_expiry_date", { required: "tarih boş geçilemez" })}
>
                   {(inputProps: any) => (
                    <TextField
                     {...inputProps}
                     label="MM/YY"
                    fullWidth
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.card_expiry_date}
                     />
                     )}
                </InputMask>

            </Grid2>

            <Grid2 size={{xs: 12 , md: 6}}>
                <InputMask 
                mask="999"
                {...register("card_cvv", { required: "cvv boş geçilemez" })}
>
                   {(inputProps: any) =>(
                 <TextField 
                 {...inputProps}
                    label="cvv" 
                    fullWidth 
                    sx={{mb: 2}} 
                    size="small"
                    error={!!errors.card_cvv}
                        />
                        )}
                    </InputMask>
            </Grid2>

        </Grid2>
    );
}