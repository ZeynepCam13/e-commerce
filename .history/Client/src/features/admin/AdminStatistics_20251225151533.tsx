import { Box, Grid, Paper, Typography, Stack, Container, Divider } from "@mui/material";
import { TrendingUp, ShoppingBag, Payments, Group, QueryStats } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const COLORS = ['#000000', '#333333', '#666666', '#999999'];

export default function AdminStatistics() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#fcfcfc", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <QueryStats sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>Mağaza Analizi</Typography>
            <Typography variant="body2" color="text.secondary">Satış performansınızı ve müşteri eğilimlerini takip edin.</Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* Özet Kartları */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatCard title="Aylık Ciro" value="₺128.400" icon={<Payments />} />
          <StatCard title="Toplam Sipariş" value="452" icon={<ShoppingBag />} />
          <StatCard title="Yeni Müşteriler" value="84" icon={<Group />} />
          <StatCard title="Büyüme" value="+%24" icon={<TrendingUp />} />
        </Grid>

        <Grid container spacing={3}>
          {/* Satış Trendi Grafiği */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee", borderRadius: 4, height: 450 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Satış Grafiği (Son 30 Gün)</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={mockMonthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="black" strokeWidth={4} dot={{ r: 6, fill: "black" }} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* En Çok Satan Kategoriler */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee", borderRadius: 4, height: 450 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Popüler Kategoriler</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={mockCategoryData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee", borderRadius: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '50%', bgcolor: '#f5f5f5', mb: 2 }}>{icon}</Box>
        <Typography variant="h5" fontWeight="800">{value}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight="bold">{title}</Typography>
      </Paper>
    </Grid>
  );
}

const mockMonthlySales = [
    { date: '01.12', amount: 4000 }, { date: '08.12', amount: 3000 }, 
    { date: '15.12', amount: 5500 }, { date: '22.12', amount: 4800 }, { date: '25.12', amount: 7200 }
];

const mockCategoryData = [
  { name: 'Kazak', value: 400 }, { name: 'Bot', value: 300 }, { name: 'Jean', value: 200 }
];