export async function fetchSimilarProducts(productId: number) {
  const res = await fetch("/api/ai/similar-products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    throw new Error("Benzer ürünler alınamadı");
  }

  return res.json();
}
