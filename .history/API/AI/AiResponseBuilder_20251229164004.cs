using API.AI;

namespace API.AI
{
    public static class AiResponseBuilder
    {
        public static string BuildIntro(AiIntent intent)
        {
            return intent switch
            {
                AiIntent.OrderList =>
                    "Siparişlerini senin için kontrol ediyorum.",

                AiIntent.OrderStatusQuestion =>
                    "Siparişlerinin durumuna baktım. İşte detaylar:",

                AiIntent.OutfitSuggestion =>
                    "Bu kombin için sana kısa bir öneri bırakayım.",

                AiIntent.ProductSearch =>
                    "Aradığın ürünlere birlikte bakalım.",

                AiIntent.SmallTalk =>
                    "Merhaba! Sana yardımcı olmaktan memnuniyet duyarım.",

                _ =>
                    "Seni tam anlayamadım ama yardımcı olmaya çalışayım."
            };
        }
    }
}
