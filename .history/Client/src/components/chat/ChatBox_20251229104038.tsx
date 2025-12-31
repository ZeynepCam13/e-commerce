import {
  Box, Button, TextField, Typography, Paper,
  IconButton, Stack, CircularProgress
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { SmartToy, Send, Close } from "@mui/icons-material";

export default function ChatBox() {
  const { user } = useAppSelector(state => state.account);

  const [messages, setMessages] = useState<any[]>([
    { type: "text", message: "Merhaba! Size nasıl yardımcı olabilirim?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const send = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: "text", message: input, fromUser: true }]);
    setInput("");
    setLoading(true);

    const res = await fetch("http://localhost:5198/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(user?.token && { Authorization: `Bearer ${user.token}` })
      },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    setMessages(prev => [...prev, data]);
    setLoading(false);
  };

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
      {!open && (
        <IconButton onClick={() => setOpen(true)} sx={{ bgcolor: "black", color: "white" }}>
          <SmartToy />
        </IconButton>
      )}

      {open && (
        <Paper sx={{ width: 320, height: 450, p: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight="bold">AI Asistan</Typography>
            <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto", mt: 1 }}>
            {messages.map((m, i) => (
              <Box key={i} sx={{ mb: 1 }}>
                <Typography>{m.message}</Typography>

                {m.type === "products" && (
                  <Stack spacing={1}>
                    {m.products.map((p: any) => (
                      <Button
                        key={p.id}
                        component={Link}
                        to={`/catalog/${p.id}`}
                        variant="outlined"
                      >
                        {p.name} – {p.price} TL
                      </Button>
                    ))}
                  </Stack>
                )}

                {m.type === "orders" && (
                  <Stack spacing={1}>
                    {m.orders.map((o: any) => (
                      <Typography key={o.id}>
                        #{o.id} – {o.status} – {o.total} TL
                      </Typography>
                    ))}
                  </Stack>
                )}
              </Box>
            ))}

            {loading && <CircularProgress size={16} />}
          </Box>

          <TextField
            size="small"
            fullWidth
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Bir şey sor..."
            InputProps={{
              endAdornment: (
                <IconButton onClick={send}>
                  <Send />
                </IconButton>
              )
            }}
          />
        </Paper>
      )}
    </Box>
  );
}
