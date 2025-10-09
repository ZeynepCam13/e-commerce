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
                    label="Enter card name" 
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
                    label="Enter card number" 
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
  {...register("card_expiry_date", { required: "Expiry date is required" })}
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
                 <TextField 
                    {...register("card_cvv", {required: "Cvv is required"})}
                    label="Enter cvv" 
                    fullWidth 
                    sx={{mb: 2}} 
                    size="small"
                    error={!!errors.card_cvv}></TextField>
            </Grid2>

        </Grid2>
    );
}