import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

function getBotReply(message: string): string {
  const text = message.toLowerCase();

  if (text.includes("kargo")) {
    return "Siparişleriniz 1–3 iş günü içinde kargoya verilir 📦";
  }

  if (text.includes("iade")) {
    return "14 gün içinde ücretsiz iade yapabilirsiniz.";
  }

  if (text.includes("beden")) {
    return "Ürün sayfasında beden tablosunu inceleyebilirsiniz. Kararsızsanız yardımcı olabilirim.";
  }

  if (text.includes("indirim")) {
    return "İndirimli ürünleri 'İndirim' sayfasında görebilirsiniz 🔥";
  }

  if (text.includes("stok")) {
    return "Stok durumu ürün detay sayfasında anlık olarak gösterilmektedir.";
  }

  return "Bunu anlayamadım 😕 Canlı destek ekibine yönlendirebilirim.";
}

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "Merhaba! Size nasıl yardımcı olabilirim?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setInput("");

    setTimeout(() => {
      const botReply = getBotReply(userMessage);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply },
      ]);
    }, 600);
  };

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
      <Typography fontWeight="bold" mb={1}>
        Canlı Destek
      </Typography>

      <Box sx={{ height: 220, overflowY: "auto", mb: 1 }}>
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              textAlign: msg.sender === "user" ? "right" : "left",
              mb: 1,
            }}
          >
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
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Mesaj yaz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>
          Gönder
        </Button>
      </Box>
    </Box>
  );
}
