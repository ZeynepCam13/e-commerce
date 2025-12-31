import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Stack, Container, Divider, CircularProgress } from "@mui/material";
import { TrendingUp, ShoppingBag, Payments, Group, QueryStats } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import axios from "axios";
import { toast } from "react-toastify";

const COLORS = ['#000000', '#424242', '#757575', '#bdbdbd'];

export default function AdminStatistics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    axios.get("/api/stats") 
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("İstatistik hatası:", err);
        toast.error("Veriler yüklenirken bir hata oluştu.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#fcfcfc", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <QueryStats sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>Mağaza Analizi</Typography>
            <Typography variant="body2" color="text.secondary">
              Veritabanındaki gerçek sipariş verilerine göre hazırlanan performans raporu.
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatCard 
            title="Toplam Ciro" 
            value={`₺${stats?.totalSales?.toLocaleString() || '0'}`} 
            icon={<Payments />} 
          />
          <StatCard 
            title="Toplam Sipariş" 
            value={stats?.totalOrders || '0'} 
            icon={<ShoppingBag />} 
          />
          <StatCard 
            title="Son 30 Gün Müşteri" 
            value={stats?.newCustomers || '0'} 
            icon={<Group />} 
          />
          <StatCard 
            title="Büyüme" 
            value="+%0" 
            icon={<TrendingUp />} 
          />
        </Grid>

        <Grid container spacing={3}>
         
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee", borderRadius: 4, height: 450 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Satış Grafiği (Son 30 Gün)</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={stats?.salesTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="black" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: "black" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

        
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee", borderRadius: 4, height: 450 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Kategorilere Göre Satış</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={stats?.categoryStats || []}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {(stats?.categoryStats || []).map((_: any, index: number) => (
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
        <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '50%', bgcolor: '#f5f5f5', mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h5" fontWeight="800">{value}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight="bold">{title}</Typography>
      </Paper>
    </Grid>
  );
}