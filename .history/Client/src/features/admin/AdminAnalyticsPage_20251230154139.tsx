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
  Pie,
  Cell,
  Legend,
  PieChart,
  CartesianGrid,
} from "recharts";

/* ---------- TYPES ---------- */

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

type TopProduct = {
  productId: number;
  productName: string;
  totalSold: number;
  totalRevenue: number;
};

type OrderStatusData = {
  status: string;
  count: number;
};

/* ---------- COMPONENT ---------- */

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthlyChart, setMonthlyChart] = useState<ChartData[]>([]);
  const [dailyChart, setDailyChart] = useState<ChartData[]>([]); // Günlük veri state'i
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);

  const STATUS_COLORS: Record<string, string> = {
    Pending: "#ff9800",
    Approved: "#2196f3",
    PaymentFailed: "#f44336",
    Completed: "#4caf50",
  };

  const STATUS_LABELS: Record<string, string> = {
    Pending: "Beklemede",
    Approved: "Hazırlanıyor",
    PaymentFailed: "Ödeme Başarısız",
    Completed: "Teslim Edildi",
  };

  useEffect(() => {
    setLoading(true);
    
    // Tüm verileri çekiyoruz
    Promise.all([
      requests.AdminAnalytics.orderStatus().then(setOrderStatusData),
      requests.AdminAnalytics.topProducts().then(setTopProducts),
      requests.AdminAnalytics.summary().then(setSummary),
      
      // Aylık Veri
      requests.AdminAnalytics.monthlyRevenue().then((data: MonthlyRevenue[]) => {
        const formatted: ChartData[] = data.map((d) => ({
          name: `${d.month}/${d.year}`,
          revenue: d.totalRevenue,
        }));
        setMonthlyChart(formatted);
      }),

      // Günlük Veri (Yeni yazdığın backend'e bağlanıyor)
      requests.AdminAnalytics.dailyRevenue().then((data: any[]) => {
        const formatted = data.map(d => ({
            name: `${d.hour}:00`, 
            revenue: d.totalRevenue
        }));
        setDailyChart(formatted);
      })
    ]).finally(() => setLoading(false));
  }, []);

  /* ---------- LOADING & ERROR ---------- */

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
            <Typography variant="body2" color="text.secondary">Toplam Ürün</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>{summary.totalProducts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">Toplam Sipariş</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>{summary.totalOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">Toplam Ciro</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              ₺{summary.totalRevenue.toLocaleString("tr-TR")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* GRAFİKLER SATIRI (GÜNLÜK - HAFTALIK - AYLIK) */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        
        {/* GÜNLÜK GRAFİK - dailyChart'a bağlandı */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "orange" }}>
              Günlük Satış
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip formatter={(val) => `₺${Number(val).toLocaleString("tr-TR")}`} />
                <Line type="monotone" dataKey="revenue" stroke="#ff9800" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* HAFTALIK GRAFİK - Şimdilik aylık veriyi kullanıyor */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "purple" }}>
              Haftalık Satış (Geçici Veri)
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip formatter={(val) => `₺${Number(val).toLocaleString("tr-TR")}`} />
                <Line type="monotone" dataKey="revenue" stroke="#9c27b0" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* AYLIK GRAFİK */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#1976d2" }}>
              Aylık Satış Grafiği
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip formatter={(val) => `₺${Number(val).toLocaleString("tr-TR")}`} />
                <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* ALT PANEL: DURUM DAĞILIMI VE ÜRÜNLER */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Sipariş Durumu Dağılımı</Typography>
            {orderStatusData.length === 0 ? (
              <Typography color="text.secondary">Veri yok.</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    label={({ payload }) => STATUS_LABELS[payload.status] ?? payload.status}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] ?? "#9e9e9e"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, STATUS_LABELS[name as string] ?? name]} />
                  <Legend formatter={(value) => STATUS_LABELS[value] ?? value} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>En Çok Satan Ürünler</Typography>
            {topProducts.length === 0 ? (
              <Typography color="text.secondary">Satış yok.</Typography>
            ) : (
              <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #eee" }}>
                    <th align="left" style={{ padding: "8px" }}>Ürün</th>
                    <th align="right" style={{ padding: "8px" }}>Adet</th>
                    <th align="right" style={{ padding: "8px" }}>Ciro</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.productId} style={{ borderBottom: "1px solid #fafafa" }}>
                      <td style={{ padding: "8px" }}>{p.productName}</td>
                      <td align="right" style={{ padding: "8px" }}>{p.totalSold}</td>
                      <td align="right" style={{ padding: "8px" }}>₺{p.totalRevenue.toLocaleString("tr-TR")}</td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}