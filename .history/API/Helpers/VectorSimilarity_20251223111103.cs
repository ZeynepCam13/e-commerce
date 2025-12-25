public static class VectorSimilarity
{
    public static float Cosine(float[] v1, float[] v2)
    {
        if (v1.Length != v2.Length) return 0;

        float dot = 0f;
        float mag1 = 0f;
        float mag2 = 0f;

        for (int i = 0; i < v1.Length; i++)
        {
            dot += v1[i] * v2[i];
            mag1 += v1[i] * v1[i];
            mag2 += v2[i] * v2[i];
        }

        return dot / (MathF.Sqrt(mag1) * MathF.Sqrt(mag2));
    }
}
