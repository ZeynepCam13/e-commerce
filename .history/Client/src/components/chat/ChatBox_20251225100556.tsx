import { Box, Button, TextField, Typography, Paper, IconButton, Stack, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router"; 
import { useAppSelector } from "../../store/store";
import { SmartToy, Send, Close, ChatBubbleOutline } from "@mui/icons-material";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};


 
function renderMessage(text: string) {
 
  const sanitizedText = text
    .replace(/https?:\/\/[^\s)]+/g, "") 
    .replace(/[()\[\]]/g, " "); 

  const parts = sanitizedText.split(/(\/catalog\/\d+)/g);

  return parts.map((part, index) => {
 
    if (/\/catalog\/\d+/.test(part)) {
      const cleanPath = part.trim(); 
      
      return (
        <Button
          key={index}
          component={Link}
          to={cleanPath} 
          variant="contained"
          sx={{
            mt: 1, mb: 1, 
            bgcolor: "black", 
            color: "white",
            fontWeight: "bold", 
            textTransform: "none", 
            display: "block",
            "&:hover": { bgcolor: "#333" }
          }}
        >
          Ürünü İncele
        </Button>
      );
    }
    
    return <span key={index}>{part}</span>;
  });
}

export default function ChatBox() {
  const { user } = useAppSelector((state) => state.account);
  const chatStorageKey = user?.token ? `chat_messages_user_${user.token}` : "chat_messages_guest";
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem(chatStorageKey);
    return stored ? JSON.parse(stored) : [{ sender: "bot", text: "Merhaba! Ben stil danışmanınız. Size nasıl yardımcı olabilirim?" }];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem(chatStorageKey, JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5198/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Şu an yanıt veremiyorum, lütfen daha sonra tekrar deneyin." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 30, right: 30, zIndex: 2000 }}>
      
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            width: 60, height: 60, bgcolor: "black", color: "white",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            "&:hover": { bgcolor: "#333" }
          }}
        >
          <SmartToy fontSize="large" />
        </IconButton>
      )}


      {isOpen && (
        <Paper
          elevation={12}
          sx={{
            width: 350, height: 500, borderRadius: 4, display: "flex",
            flexDirection: "column", overflow: "hidden", border: "1px solid #eee"
          }}
        >
     
          <Box sx={{ bgcolor: "black", p: 2.5, color: "white" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <SmartToy />
                <Box>
                  <Typography variant="body1" fontWeight="800">AI Stil Danışmanı</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Çevrimiçi</Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: "white" }}>
                <Close fontSize="small" />
              </IconButton>
            </Stack>
          </Box>


          <Box sx={{ flexGrow: 1, p: 2, bgcolor: "#f8f9fa", overflowY: "auto", display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%", mb: 2
                }}
              >
                <Typography
                  sx={{
                    px: 2, py: 1.2, borderRadius: 3, fontSize: "0.85rem",
                    bgcolor: msg.sender === "user" ? "black" : "white",
                    color: msg.sender === "user" ? "white" : "black",
                    boxShadow: msg.sender === "user" ? "none" : "0 2px 5px rgba(0,0,0,0.05)",
                    border: msg.sender === "user" ? "none" : "1px solid #eee",
                    lineHeight: 1.5
                  }}
                >
                  {renderMessage(msg.text)}
                </Typography>
              </Box>
            ))}
            {loading && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <CircularProgress size={14} color="inherit" />
                <Typography variant="caption" color="text.secondary">Yanıt hazırlanıyor...</Typography>
              </Stack>
            )}
            <div ref={messagesEndRef} />
          </Box>


          <Box sx={{ p: 2, bgcolor: "white", borderTop: "1px solid #eee" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Bir şeyler sorun..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#fcfcfc" }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSend} disabled={loading || !input.trim()} size="small">
                    <Send fontSize="small" sx={{ color: input.trim() ? "black" : "#ccc" }} />
                  </IconButton>
                )
              }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}