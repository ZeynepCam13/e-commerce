import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";

type Props = {
  name: string;
  brand: string;
  categoryId: number | null;
  onGenerated: (data: {
    description: string;
    seoTitle: string;
    seoDescription: string;
  }) => void;
};

export default function AiProductContentButton({
  name,
  brand,
  categoryId,
  onGenerated,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5198/api/admin/ai/product-content",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, brand, categoryId }),
        }
      );

      const data = await res.json();
      onGenerated(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      disabled={!name || !brand || !categoryId || loading}
      onClick={handleGenerate}
    >
      {loading ? <CircularProgress size={20} /> : "🤖 AI ile Açıklama & SEO"}
    </Button>
  );
}
