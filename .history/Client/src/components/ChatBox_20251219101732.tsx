import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

const CHAT_STORAGE_KEY = "chat_messages";

function renderMessage(text: string) {
  const parts = text.split(/(\/catalog\/\d+)/g);

  return parts.map((part, index) => {
    if (part.match(/\/catalog\/\d+/)) {
      return (
        <Link
          key={index}
          to={part}
          style={{
            color: "#1976d2",
            fontWeight: 600,
            display: "block",
            marginTop: 4,
            textDecoration: "none",
          }}
        >
          Ürünü görüntüle
        </Link>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : [
          {
            sender: "bot",
            text: "Merhaba! Aradığınız ürünü yazın, size yardımcı olayım.",
          },
        ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5198/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Bir hata oluştu, lütfen tekrar deneyin." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHAT KAPALIYKEN SADECE İKON
  if (!isOpen) {
    return (
      <Box
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "#000",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: 4,
          zIndex: 2000,
          fontSize: 24,
        }}
      >
        💬
      </Box>
    );
  }

  // ✅ CHAT AÇIKKEN PENCERE
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 300,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 4,
        p: 2,
        zIndex: 2000,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography fontWeight="bold">Canlı Destek</Typography>
        <Button
          size="small"
          onClick={() => setIsOpen(false)}
          sx={{ minWidth: "auto", fontSize: 18 }}
        >
          ×
        </Button>
      </Box>

      <Button
        size="small"
        onClick={() => {
          localStorage.removeItem(CHAT_STORAGE_KEY);
          setMessages([
            {
              sender: "bot",
              text: "Merhaba! Aradığınız ürünü yazın, size yardımcı olayım.",
            },
          ]);
        }}
      >
        Temizle
      </Button>

      <Box sx={{ height: 220, overflowY: "auto", mb: 1 }}>
        {messages.map((msg, i) => (
          <Box key={i} sx={{ textAlign: msg.sender === "user" ? "right" : "left", mb: 1 }}>
            <Typography
              sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.8,
                borderRadius: 1,
                bgcolor: msg.sender === "user" ? "#000" : "#f1f1f1",
                color: msg.sender === "user" ? "white" : "black",
                fontSize: "0.85rem",
              }}
            >
              {renderMessage(msg.text)}
            </Typography>
          </Box>
        ))}
        {loading && (
          <Typography fontSize="0.8rem" color="gray">
            Yazıyor...
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Mesaj yaz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <Button variant="contained" onClick={handleSend} disabled={loading}>
          Gönder
        </Button>
      </Box>
    </Box>
  );
}
