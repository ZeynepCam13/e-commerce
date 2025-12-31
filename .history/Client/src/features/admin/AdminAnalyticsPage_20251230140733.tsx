import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import requests from "../../api/requests";

type AnalyticsSummary = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
};

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!summary) {
    return (
      <Typography sx={{ textAlign: "center", mt: 10 }}>
        Analiz verisi bulunamadı.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Yönetici Analiz Paneli
      </Typography>

      {/* KPI KARTLARI */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Toplam Ürün
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summary.totalProducts}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Toplam Sipariş
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summary.totalOrders}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Toplam Ciro
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              ₺{summary.totalRevenue.toLocaleString("tr-TR")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* GRAFİK ALANI (şimdilik placeholder) */}
      <Box sx={{ mt: 5 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Satış Analizleri (yakında)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bu alana günlük / aylık satış grafikleri eklenecek.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
