import { Button,Container,Typography } from "@mui/material";
import requests from "../api/requests";

export default function ErrorPage(){
    return(
        <Container>
            <Button sx={{mr:2}} variant="contained" onClick={()=> requests.Errors.get404Error().catch(error=>console.log(error))}>
               404 Error
            </Button>
            <Button sx={{mr:2}} variant="contained" onClick={()=> requests.Errors.get500Error().catch(error=>console.log(error))}>
               500 Error
            </Button>
        </Container>
    )
}