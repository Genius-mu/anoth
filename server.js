import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MOCK ENDPOINT
app.post("/v1/ai/emr", (req, res) => {
  const { prompt, patient } = req.body;

  if (!prompt || !patient) {
    return res.status(400).json({
      status: false,
      status_code: 400,
      message: "Invalid request. Provide prompt and patient.",
      resource: "Error",
    });
  }

  // ---- SIMPLE MOCK LOGIC ----
  let resourceType = "Encounter";
  if (prompt.toLowerCase().includes("appointment")) {
    resourceType = "Appointment";
  }

  const mockResponse = {
    status: true,
    status_code: 201,
    message: "Mock response generated",
    resource: resourceType,
    data:
      resourceType === "Appointment"
        ? {
            date: "2025-01-10",
            time: "10:00 AM",
            reason: prompt,
            patient,
          }
        : {
            symptoms: prompt,
            diagnosis: "Mock diagnosis",
            patient,
          },
  };

  return res.status(201).json(mockResponse);
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`Mock API running on port ${PORT}`));
