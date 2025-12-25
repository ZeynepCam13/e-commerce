import { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Merhaba! Size nasıl yardımcı olabilirim?" },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    const botMessage: Message = {
      sender: "bot",
      text: "Bu şu an demo bir cevap 🙂",
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <>
      {/* CHAT BUTTON */}
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <ChatIcon />
      </IconButton>

      {/* CHAT WINDOW */}
      {open && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 320,
            height: 400,
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          <Typography fontWeight="bold" mb={1}>
            Canlı Destek
          </Typography>

          {/* MESSAGES */}
          <Box sx={{ flex: 1, overflowY: "auto", mb: 1 }}>
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    bgcolor:
                      msg.sender === "user"
                        ? "primary.main"
                        : "grey.300",
                    color:
                      msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
          </Box>

          {/* INPUT */}
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
        </Paper>
      )}
    </>
  );
}
