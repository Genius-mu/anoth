import axios from "axios";

export async function createPatientRecord(text, patientId) {
  try {
    const res = await axios.post(
      "https://dosewise-2p1n.onrender.comPOST/v1/patients/create",
      { text, patientId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_MEDICAL_API_KEY}`,
        },
      }
    );

    return res.data; // Contains the created resource, pharmacies, etc.
  } catch (err) {
    if (err.response) {
      console.error("API error:", err.response.status, err.response.data);
    } else {
      console.error("Network/API error:", err.message);
    }
    return null;
  }
}
