import { Box, Typography, TextField, Button, Paper } from "@mui/material";

export default function SettingsPage() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" gutterBottom>
          Hesap Ayarları
        </Typography>

        <TextField
          label="Ad Soyad"
          fullWidth
          sx={{ mb: 2 }}
          defaultValue="Zeynep Çam"
        />
        <TextField
          label="E-posta"
          fullWidth
          sx={{ mb: 2 }}
          defaultValue="zeynep@example.com"
        />
        <TextField
          label="Şifre"
          type="password"
          fullWidth
          sx={{ mb: 3 }}
        />

        <Button variant="contained" color="primary" fullWidth>
          Kaydet
        </Button>
      </Paper>
    </Box>
  );
}
