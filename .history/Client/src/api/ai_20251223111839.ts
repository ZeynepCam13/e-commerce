export async function fetchSimilarProducts(productId: number) {
  const res = await fetch(
    `http://localhost:5198/api/products/${productId}/similar`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    throw new Error("Benzer ürünler alınamadı");
  }

  return res.json();
}
