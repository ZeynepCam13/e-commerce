using API.AI;

namespace API.AI
{
    public static class AiIntentDetector
    {
        public static AiIntent Detect(string text)
        {
            text = text.ToLower();

            // 🔹 Sipariş durum sorusu (en spesifik)
            if (
                text.Contains("hangisi") &&
                text.Contains("sipariş")
            )
                return AiIntent.OrderStatusQuestion;

            // 🔹 Kombin / öneri
            if (
                text.Contains("üstüne") ||
                text.Contains("kombin") ||
                text.Contains("ne giyilir") ||
                text.Contains("hangi kazak")
            )
                return AiIntent.OutfitSuggestion;

            // 🔹 Sipariş listesi
            if (text.Contains("sipariş"))
                return AiIntent.OrderList;

            // 🔹 Ürün arama
            if (
                text.Contains("kazak") ||
                text.Contains("pantolon") ||
                text.Contains("gömlek") ||
                text.Contains("tişört") ||
                text.Contains("elbise")
            )
                return AiIntent.ProductSearch;

            // 🔹 Small talk
            if (
                text.Contains("merhaba") ||
                text.Contains("selam") ||
                text.Contains("teşekkür")
            )
                return AiIntent.SmallTalk;

            return AiIntent.Unknown;
        }
    }
}
