import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import requests from "../../api/requests";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


type AnalyticsSummary = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
};
type MonthlyRevenue = {
  year: number;
  month: number;
  totalRevenue: number;
};
type ChartData = {
  name: string;
  revenue: number;
};

const [monthlyRaw, setMonthlyRaw] = useState<MonthlyRevenue[]>([]);
const [monthlyChart, setMonthlyChart] = useState<ChartData[]>([]);

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    requests.AdminAnalytics.monthlyRevenue()
    .then((data: MonthlyRevenue[]) => {
      setMonthlyRaw(data);

      const formatted: ChartData[] = data.map(d => ({
        name: `${d.month}/${d.year}`,
        revenue: d.totalRevenue,
      }));

      setMonthlyChart(formatted);
    });

    requests.AdminAnalytics.summary()
      .then((data: AnalyticsSummary) => {
        setSummary(data);
      })
      .finally(() => setLoading(false));
  }, []);

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

     <Box sx={{ mt: 5 }}>
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Aylık Satış Grafiği
    </Typography>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={monthlyChart}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number) => `₺${value.toLocaleString("tr-TR")}`} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#1976d2"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
</Box>

    </Box>
  );
}
