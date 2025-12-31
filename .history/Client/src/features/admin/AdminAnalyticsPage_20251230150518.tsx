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
  const [monthlyRaw, setMonthlyRaw] = useState<MonthlyRevenue[]>([]);
  const [monthlyChart, setMonthlyChart] = useState<ChartData[]>([]);
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
    requests.AdminAnalytics.orderStatus()
  .then((data: OrderStatusData[]) => {
    setOrderStatusData(data);
  });
    requests.AdminAnalytics.topProducts()
  .then((data: TopProduct[]) => {
    setTopProducts(data);
  });

    // Aylık ciro
    requests.AdminAnalytics.monthlyRevenue()
      .then((data: MonthlyRevenue[]) => {
        setMonthlyRaw(data);

        const formatted: ChartData[] = data.map(d => ({
          name: `${d.month}/${d.year}`,
          revenue: d.totalRevenue,
        }));

        setMonthlyChart(formatted);
      });

    // KPI özet
    requests.AdminAnalytics.summary()
      .then((data: AnalyticsSummary) => {
        setSummary(data);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- LOADING ---------- */

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

  /* ---------- UI ---------- */

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

      {/* AYLIK SATIŞ GRAFİĞİ */}
      <Box sx={{ mt: 5 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Aylık Satış Grafiği
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
  <LineChart data={monthlyChart}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip
      formatter={(value) => {
        if (typeof value === "number") {
          return `₺${value.toLocaleString("tr-TR")}`;
        }
        return value;
      }}
    />
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



<Box sx={{ mt: 5 }}>
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Sipariş Durumu Dağılımı
    </Typography>

    {orderStatusData.length === 0 ? (
      <Typography color="text.secondary">
        Sipariş verisi bulunamadı.
      </Typography>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
  data={orderStatusData}
  dataKey="count"
  nameKey="status"
  cx="50%"
  cy="50%"
  innerRadius={40}
  outerRadius={100}
  label={({ payload }) =>
    `${STATUS_LABELS[payload.status] ?? payload.status} (${payload.count})`
  }
>
  {orderStatusData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={STATUS_COLORS[entry.status] ?? "#9e9e9e"}
    />
  ))}
</Pie>

<Tooltip
/>

<Legend
  formatter={(value: string) =>
    STATUS_LABELS[value] ?? value
  }
/>


          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )}
  </Paper>
</Box>


      <Box sx={{ mt: 5 }}>
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      En Çok Satan Ürünler
    </Typography>

    {topProducts.length === 0 ? (
      <Typography color="text.secondary">
        Henüz satış verisi yok.
      </Typography>
    ) : (
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Ürün</th>
            <th align="right">Satılan Adet</th>
            <th align="right">Ciro</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map(p => (
            <tr key={p.productId}>
              <td>{p.productName}</td>
              <td align="right">{p.totalSold}</td>
              <td align="right">
                ₺{p.totalRevenue.toLocaleString("tr-TR")}
              </td>
            </tr>
          ))}
        </tbody>
      </Box>
    )}
  </Paper>
</Box>

    </Box>
  );
}
