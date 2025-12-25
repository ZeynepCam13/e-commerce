import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../store/store";

type Props = {
  name: string;
  marka: string;
  categoryId: number | null;
  onGenerated: (data: {
    description: string;
    seoTitle: string;
    seoDescription: string;
  }) => void;
};

export default function AiProductContentButton({
  name,
  marka,
  categoryId,
  onGenerated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.account);

  const handleGenerate = async () => {
    if (!user?.token) {
      alert("Bu işlem için admin girişi gerekli");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5198/api/admin/ai/product-content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, 
          },
          body: JSON.stringify({
            name,
            marka,
            categoryId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("AI içerik üretimi başarısız");
      }

      const data = await res.json();
      onGenerated(data);
    } catch (err) {
      console.error(err);
      alert("AI içerik oluşturulurken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      disabled={!name || !marka || !categoryId || loading}
      onClick={handleGenerate}
      startIcon={loading ? <CircularProgress size={18} /> : null}
    >
      🤖 AI ile Açıklama & SEO
    </Button>
  );
}
