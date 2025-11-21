// // api.js
// export async function sendSymptomToAI(text) {
//   const res = await fetch("https://api.dorra.com/v1/ai/emr", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${import.meta.env.VITE_MEDICAL_API_KEY}`,
//     },
//     body: JSON.stringify({ message: text }),
//   });

//   const data = await res.json();
//   return data.summary; // or whatever field your backend returns
// }

export async function sendSymptomToAI(text, patientId = 0) {
  try {
    const res = await fetch("https://hackathon-api.aheadafrica.org/v1/ai/emr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_MEDICAL_API_KEY}`,
      },
      body: JSON.stringify({ prompt: text, patient: patientId }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("API error:", res.status, errorData);
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    // Dorra API returns 'resource' or 'summary'
    return data.resource || data.summary || "No structured response";
  } catch (err) {
    console.error("Network/API error:", err);
    return "Error: Could not fetch response.";
  }
}

console.log("Using API Key:", import.meta.env.VITE_MEDICAL_API_KEY);
