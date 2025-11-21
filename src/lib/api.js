export async function analyzeSymptoms(message) {
  const res = await fetch("https://your-api-endpoint/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
    },
    body: JSON.stringify({
      text: message,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to analyze symptoms.");
  }

  return await res.json();
}
