import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { SmartToy, Send, Close } from "@mui/icons-material";

type ChatMessage =
  | {
      type: "text";
      message: string;
      fromUser?: boolean;
    }
  | {
      type: "products";
      message: string;
      products: {
        id: number;
        name: string;
        price: number;
        imageUrl?: string;
      }[];
    }
  | {
      type: "orders";
      message: string;
      orders: {
        id: number;
        status: string;
        total: number;
      }[];
    };

export default function ChatBox() {
  const { user } = useAppSelector((state) => state.account);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: "text", message: "Merhaba! Size nasıl yardımcı olabilirim?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { type: "text", message: userText, fromUser: true },
    ]);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5198/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token && {
            Authorization: `Bearer ${user.token}`,
          }),
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, data]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          message: "Bir hata oluştu, lütfen tekrar deneyin.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000 }}>
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            width: 60,
            height: 60,
            bgcolor: "black",
            color: "white",
            "&:hover": { bgcolor: "#333" },
          }}
        >
          <SmartToy />
        </IconButton>
      )}

      {open && (
        <Paper
          elevation={10}
          sx={{
            width: 360,
            height: 520,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              p: 2,
              bgcolor: "black",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight={700}>AI Asistan</Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>

          {/* MESSAGES */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              bgcolor: "#f5f5f5",
            }}
          >
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    "fromUser" in m && m.fromUser ? "flex-end" : "flex-start",
                }}
              >
                {/* TEXT */}
                {"message" in m && (
                  <Box
                    sx={{
                      bgcolor:
                        "fromUser" in m && m.fromUser ? "#000" : "#fff",
                      color:
                        "fromUser" in m && m.fromUser ? "#fff" : "#000",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: "80%",
                      fontSize: 14,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    {m.message}
                  </Box>
                )}

                {/* PRODUCTS */}
                {m.type === "products" && (
                  <Stack spacing={1} mt={1} width="100%">
                    {m.products.map((p) => (
                      <Box
                        key={p.id}
                        component={Link}
                        to={`/catalog/${p.id}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1,
                          borderRadius: 2,
                          bgcolor: "#fff",
                          textDecoration: "none",
                          color: "inherit",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                          "&:hover": { bgcolor: "#f0f0f0" },
                        }}
                      >
                        {p.imageUrl && (
                          <Box
                            component="img"
                            src={p.imageUrl}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1,
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <Box>
                          <Typography fontSize={13} fontWeight={600}>
                            {p.name}
                          </Typography>
                          <Typography fontSize={12} color="text.secondary">
                            {p.price} TL
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}

                {/* ORDERS */}
                {m.type === "orders" && (
                  <Stack spacing={1} mt={1}>
                    {m.orders.map((o) => (
                      <Box
                        key={o.id}
                        sx={{
                          bgcolor: "#fff",
                          p: 1,
                          borderRadius: 2,
                          fontSize: 13,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        #{o.id} – {o.status} – {o.total} TL
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            ))}

            {loading && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={14} />
                <Typography fontSize={12}>Yanıt hazırlanıyor...</Typography>
              </Stack>
            )}
          </Box>

          {/* INPUT */}
          <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Bir şey sorun..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={sendMessage} disabled={loading}>
                    <Send />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}
