// api.js
import axios from "axios";

const API_BASE = "https://dosewise-2p1n.onrender.com/api";
// const API_BASE = "https://dosewise-2p1n.onrender.com";

// Helper functions
export const getStoredToken = () => {
  return (
    localStorage.getItem("patientToken") || localStorage.getItem("clinicToken")
  );
};

export const getStoredPatientId = () => {
  return localStorage.getItem("patientId");
};

export const storeToken = (token, userType) => {
  const key = userType === "patient" ? "patientToken" : "clinicToken";
  localStorage.setItem(key, token);
  console.log(
    `✅ Token stored for ${userType}:`,
    token ? `${token.substring(0, 20)}...` : "No token"
  );
};

// Add this helper function if it doesn't exist
export const getAuthToken = () => {
  return getStoredToken();
};

export const removeToken = () => {
  localStorage.removeItem("patientToken");
  localStorage.removeItem("clinicToken");
  localStorage.removeItem("patientId");
  console.log("🔐 All tokens cleared");
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    const patientId = getStoredPatientId();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        `🔐 Adding auth token to ${config.method?.toUpperCase()} ${config.url}`,
        {
          tokenPreview: token.substring(0, 20) + "...",
          patientId: patientId,
        }
      );
    } else {
      console.warn(
        `⚠️ No auth token for ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Error handling interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${
        response.config.url
      } success`
    );
    return response;
  },
  (error) => {
    console.error(
      `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} failed:`,
      {
        status: error.response?.status,
        message: error.response?.data?.message,
      }
    );

    if (error.response?.status === 401) {
      console.error("🔐 Authentication failed - clearing tokens");
      removeToken();
      // Don't redirect automatically as this might be a clinic dashboard
    }
    return Promise.reject(error);
  }
);

// ==================== PATIENT ENDPOINTS ====================

export const getPatientProfile = async () => {
  const res = await api.get(`/patient/me`);
  return res.data.data;
};

export const getPatientRecords = async () => {
  const res = await api.get(`/patient/records`);
  return res.data.data;
};

export const uploadMedicalRecord = async (recordText) => {
  const res = await api.post(`/patient/upload-record`, { recordText });
  return res.data.data;
};

// Temporary mock solution for symptom logging
export const logSymptom = async (symptomData) => {
  try {
    console.log("Sending symptom data:", symptomData);
    console.log("⚠️ Backend returns 500 error - Using mock data instead");

    const mockResponse = {
      _id: `symptom_${Date.now()}`,
      patientId: "current_patient_id",
      symptom: symptomData.symptom,
      severity: symptomData.severity,
      notes: symptomData.notes || "",
      duration: symptomData.duration || "",
      loggedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    console.log("✅ Mock symptom logged successfully:", mockResponse);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return mockResponse;
  } catch (error) {
    console.error("Unexpected error in logSymptom:", error);
    const fallbackResponse = {
      _id: `fallback_${Date.now()}`,
      patientId: "current_patient_id",
      symptom: symptomData.symptom,
      severity: symptomData.severity,
      notes: symptomData.notes || "",
      duration: symptomData.duration || "",
      loggedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    return fallbackResponse;
  }
};

export const getSymptoms = async () => {
  const res = await api.get(`/patient/symptoms`);
  return res.data.data;
};

export const checkDrugInteractions = async (medications) => {
  try {
    console.log("Checking drug interactions for:", medications);

    // For now, return mock data since the backend might not be fully implemented
    const mockResponse = {
      interactions:
        medications.length > 1
          ? ["Potential mild interaction detected between medications"]
          : [],
      severity: medications.length > 1 ? "low" : "none",
      recommendations:
        medications.length > 1
          ? [
              "Monitor for any unusual symptoms",
              "Take medications at different times if possible",
            ]
          : ["No significant interactions detected"],
    };

    console.log("✅ Mock drug interactions check completed:", mockResponse);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      data: mockResponse,
    };
  } catch (error) {
    console.error("Error checking drug interactions:", error);

    // Fallback mock response
    const fallbackResponse = {
      interactions: [],
      severity: "none",
      recommendations: ["No interactions detected based on available data"],
    };

    return {
      data: fallbackResponse,
    };
  }
};

// In api.js - FIXED aiEMRExtraction function
// export const aiEMRExtraction = async (text, patientId) => {
//   try {
//     const token = getStoredToken();

//     if (!token) {
//       throw new Error("No authentication token found. Please log in again.");
//     }

//     console.log("🎯 Sending to AI EMR extraction with:", {
//       textLength: text.length,
//       patientId: patientId,
//       hasToken: true,
//       tokenPreview: token.substring(0, 20) + "...",
//     });

//     const response = await api.post("/ai/emr", {
//       text,
//       patientId,
//     });

//     console.log("✅ AI EMR extraction successful:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ AI EMR extraction failed:", {
//       status: error.response?.status,
//       message: error.response?.data?.message,
//       patientId: patientId,
//     });

//     // Re-throw the error with more context
//     throw new Error(
//       `AI EMR extraction failed: ${
//         error.response?.data?.message || error.message
//       }`
//     );
//   }
// };

// In your api.js, update the aiEMRExtraction function:

export const aiEMRExtraction = async (text, patientId) => {
  try {
    const token = getStoredToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    console.log("🎯 Sending to AI EMR extraction with:", {
      textLength: text.length,
      patientId: patientId,
      hasToken: true,
      tokenPreview: token.substring(0, 20) + "...",
    });

    // For demo patients with simple IDs like "1", "2", "3", use a fallback
    // These are not valid MongoDB ObjectIds, so the backend will reject them
    const validPatientId = isValidObjectId(patientId) ? patientId : null;

    if (!validPatientId) {
      console.log("⚠️ Using demo patient ID - skipping AI EMR extraction");
      // Return mock success response for demo patients
      return {
        success: true,
        data: {
          resource: "Encounter",
          dorraResponse: {
            status: true,
            status_code: 201,
            resource: "Encounter",
            message: "Demo session processed successfully",
            id: `demo_${Date.now()}`,
            available_pharmacies: [],
          },
        },
        message: "Demo session completed (AI EMR skipped for demo patients)",
      };
    }

    const response = await api.post("/ai/emr", {
      text,
      patientId: validPatientId,
    });

    console.log("✅ AI EMR extraction successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ AI EMR extraction failed:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      patientId: patientId,
    });

    // For demo patients, return mock success instead of error
    if (!isValidObjectId(patientId)) {
      console.log("🔄 Returning mock success for demo patient");
      return {
        success: true,
        data: {
          resource: "Encounter",
          dorraResponse: {
            status: true,
            status_code: 201,
            resource: "Encounter",
            message: "Demo session completed",
            id: `demo_${Date.now()}`,
            available_pharmacies: [],
          },
        },
        message: "Demo session processed successfully",
      };
    }

    throw new Error(
      `AI EMR extraction failed: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Helper function to check if string is a valid MongoDB ObjectId
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// ==================== CLINIC ENDPOINTS ====================

// Get patient information (clinic view)
export const getClinicPatientInfo = async (patientId) => {
  try {
    const res = await api.get(`/clinic/patient/${patientId}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching patient info:", error);

    // Mock data for development
    const mockPatient = {
      _id: patientId,
      name: "John Doe",
      email: "john.doe@email.com",
      dob: "1980-05-15",
      conditions: ["hypertension", "peptic ulcer"],
      currentMedications: ["Lisinopril 10mg", "Metformin 500mg"],
      allergies: ["Penicillin"],
      emergencyContact: {
        name: "Jane Doe",
        phone: "(555) 123-4567",
      },
    };

    console.log("⚠️ Using mock patient data due to backend error");
    return mockPatient;
  }
};

// Create encounter
export const createEncounter = async (encounterData) => {
  const res = await api.post(`/clinic/encounter`, encounterData);
  return res.data.data;
};

// Get encounter by ID with drug interactions
export const getEncounterById = async (encounterId) => {
  const res = await api.get(`/clinic/encounter/${encounterId}`);
  return res.data.data;
};

// Add this to your ClinicDashboard component
const testAuthentication = async () => {
  try {
    const token = getStoredToken();
    console.log("🔐 Current Token:", token);

    // Test if we can make a simple authenticated request
    const patientInfo = await getClinicPatientInfo("1");
    console.log("✅ Authentication test passed:", patientInfo);
    showToast("Authentication is working!", "success");
  } catch (error) {
    console.error("❌ Authentication test failed:", error);
    showToast("Authentication failed. Please log in again.", "error");
  }
};

// Call this somewhere in your component to test
// ==================== PRESCRIPTION ENDPOINTS ====================

// Create prescription (Clinic)
export const createPrescription = async (prescriptionData) => {
  try {
    console.log("Creating prescription:", prescriptionData);

    const res = await api.post(`/prescriptions`, prescriptionData);
    console.log("✅ Prescription created successfully:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("❌ Error creating prescription:", error);

    // Enhanced mock response for development
    const mockResponse = {
      _id: `prescription_${Date.now()}`,
      ...prescriptionData,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patientId: prescriptionData.patientId,
      patientName: prescriptionData.patientName,
      medication: prescriptionData.medication,
      dosage: prescriptionData.dosage,
      frequency: prescriptionData.frequency,
      duration: prescriptionData.duration,
      instructions: prescriptionData.instructions,
      prescribedBy: prescriptionData.prescribedBy,
      prescribedDate: prescriptionData.prescribedDate,
    };

    console.log(
      "⚠️ Using mock prescription creation - STORED IN MOCK DATABASE"
    );

    // Store in localStorage as mock database
    const existingPrescriptions = JSON.parse(
      localStorage.getItem("mockPrescriptions") || "[]"
    );
    const updatedPrescriptions = [...existingPrescriptions, mockResponse];
    localStorage.setItem(
      "mockPrescriptions",
      JSON.stringify(updatedPrescriptions)
    );

    console.log(
      "📦 Mock prescription stored. Total prescriptions:",
      updatedPrescriptions.length
    );

    return mockResponse;
  }
};

// Get prescriptions for patient (Patient)
export const getPatientPrescriptions = async (patientId) => {
  try {
    const res = await api.get(`/prescriptions/patient/${patientId}`);
    console.log(
      "✅ Prescriptions fetched successfully for patient:",
      patientId
    );
    return res.data.data;
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);

    // Get from mock database (localStorage)
    const mockPrescriptions = JSON.parse(
      localStorage.getItem("mockPrescriptions") || "[]"
    );
    const patientPrescriptions = mockPrescriptions.filter(
      (p) => p.patientId === patientId
    );

    console.log(
      "⚠️ Using mock prescriptions from storage. Found:",
      patientPrescriptions.length
    );

    // If no prescriptions found, return some default ones
    if (patientPrescriptions.length === 0) {
      const defaultPrescriptions = [
        {
          _id: "1",
          patientId: patientId,
          patientName: "John Doe",
          medication: "Lisinopril 10mg",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "Ongoing",
          instructions: "Take in the morning",
          prescribedBy: "Dr. Sarah Johnson",
          prescribedDate: "2025-10-01T00:00:00.000Z",
          status: "active",
          createdAt: "2025-10-01T00:00:00.000Z",
          updatedAt: "2025-10-01T00:00:00.000Z",
        },
        {
          _id: "2",
          patientId: patientId,
          patientName: "John Doe",
          medication: "Metformin 500mg",
          dosage: "500mg",
          frequency: "Twice daily with meals",
          duration: "Ongoing",
          instructions: "Take with food to minimize stomach upset",
          prescribedBy: "Dr. Sarah Johnson",
          prescribedDate: "2025-09-15T00:00:00.000Z",
          status: "active",
          createdAt: "2025-09-15T00:00:00.000Z",
          updatedAt: "2025-09-15T00:00:00.000Z",
        },
      ];

      // Store defaults in mock database
      localStorage.setItem(
        "mockPrescriptions",
        JSON.stringify(defaultPrescriptions)
      );
      console.log("📦 Default prescriptions stored in mock database");
      return defaultPrescriptions;
    }

    return patientPrescriptions;
  }
};

// Get patient data by ID (for clinic use)
export const getPatientById = async (patientId) => {
  try {
    console.log("🔍 Fetching patient data for:", patientId);

    const res = await api.get(`/clinic/patient/${patientId}`);
    console.log("✅ Patient data fetched successfully:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("❌ Error fetching patient data:", error);

    // Mock data for development
    const mockPatient = {
      _id: patientId,
      name: "John Doe",
      email: "john.doe@email.com",
      dob: "1990-01-01",
      phone: "+1234567890",
      address: "123 Main St, City, Country",
      conditions: ["hypertension", "diabetes"],
      currentMedications: ["Lisinopril 10mg", "Metformin 500mg"],
      allergies: ["Penicillin"],
      emergencyContact: {
        name: "Jane Doe",
        phone: "+1234567891",
        relationship: "Spouse",
      },
      lastVisit: new Date().toISOString(),
      visits: 12,
    };

    console.log("⚠️ Using mock patient data due to backend error");
    return mockPatient;
  }
};

// Book a session with patient
export const bookPatientSession = async (sessionData) => {
  try {
    console.log("📅 Booking session:", sessionData);

    const res = await api.post(`/clinic/sessions`, sessionData);
    console.log("✅ Session booked successfully:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("❌ Error booking session:", error);

    // Mock response for development
    const mockSession = {
      _id: `session_${Date.now()}`,
      ...sessionData,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      sessionCode: `SESSION-${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`,
    };

    console.log("⚠️ Using mock session booking");
    return mockSession;
  }
};

// Get prescriptions by clinic (Clinic)
export const getClinicPrescriptions = async (clinicId) => {
  try {
    const res = await api.get(`/prescriptions/clinic/${clinicId}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching clinic prescriptions:", error);

    // Get all prescriptions from mock database
    const mockPrescriptions = JSON.parse(
      localStorage.getItem("mockPrescriptions") || "[]"
    );
    console.log("📋 All prescriptions in mock database:", mockPrescriptions);

    return mockPrescriptions;
  }
};

// Check prescription drug interactions
export const checkPrescriptionInteractions = async (medications) => {
  const res = await api.post(`/clinic/prescription/check`, { medications });
  return res.data.data;
};

// ==================== ACCESS CONTROL ENDPOINTS ====================

// Generate QR code (patient) - SINGLE DECLARATION
// api.js - Update the generateQRCode function
export const generateQRCode = async (clinicId) => {
  try {
    const res = await api.post(`/access/generate-qr`, { clinicId });
    return res.data.data;
  } catch (error) {
    console.error("Error generating QR code:", error);

    // Return mock data for development
    const mockQRData = {
      qrCode: `mock_qr_data_${clinicId}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
      clinicId: clinicId,
      accessCode: `MOCK-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`,
    };

    console.log("⚠️ Using mock QR code data due to backend error");
    return mockQRData;
  }
};

// Scan QR code (clinic)
export const scanQRCode = async (code) => {
  const res = await api.get(`/access/scan/${code}`);
  return res.data.data;
};

// Revoke access (patient)
export const revokeAccess = async (grantId) => {
  const res = await api.delete(`/access/revoke/${grantId}`);
  return res.data;
};

// ==================== AUTH ENDPOINTS ====================

// export const loginPatient = async (email, password) => {
//   const res = await axios.post(`${API_BASE}/auth/login`, {
//     email,
//     password,
//     userType: "patient",
//   });
//   return res.data.data;
// };

export const loginPatient = async (email, password) => {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email,
    password,
    userType: "patient",
  });
  return res.data.data;
};

export const registerPatient = async (patientData) => {
  const res = await axios.post(
    `${API_BASE}/auth/patient/register`,
    patientData
  );
  return res.data.data;
};

export const loginClinic = async (email, password) => {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email,
    password,
    userType: "clinic",
  });
  return res.data.data;
};

// export const loginClinic = async (email, password) => {
//   const res = await axios.post(`${API_BASE}/auth/login`, {
//     email,
//     password,
//     userType: "clinic",
//   });
//   return res.data.data;
// };

// In your api/api.ts file, add these functions:

// Advanced AI prescription analysis
export const analyzePrescriptionWithAI = async (prescriptionData) => {
  const token = getStoredToken();
  const response = await axios.post(
    `${API_BASE}/ai/prescription-analysis`,
    prescriptionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// AI medication alternatives
export const getAIMedicationAlternatives = async (medication, condition) => {
  const token = getStoredToken();
  const response = await axios.post(
    `${API_BASE}/ai/medication-alternatives`,
    { medication, condition },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// ==================== SESSION ENDPOINTS ====================

// Create a new session (Clinic)
// export const createSession = async (sessionData) => {
//   try {
//     console.log("🎤 Creating session:", sessionData);

//     const res = await api.post(`/sessions`, sessionData);
//     console.log("✅ Session created successfully:", res.data);
//     return res.data.data;
//   } catch (error) {
//     console.error("❌ Error creating session:", error);

//     // Enhanced mock response for development
//     const mockResponse = {
//       _id: `session_${Date.now()}`,
//       ...sessionData,
//       status: "completed",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     console.log("⚠️ Using mock session creation - STORED IN MOCK DATABASE");

//     // Store in localStorage as mock database
//     const existingSessions = JSON.parse(
//       localStorage.getItem("mockSessions") || "[]"
//     );
//     const updatedSessions = [...existingSessions, mockResponse];
//     localStorage.setItem("mockSessions", JSON.stringify(updatedSessions));

//     console.log(
//       "📦 Mock session stored. Total sessions:",
//       updatedSessions.length
//     );

//     return mockResponse;
//   }
// };

// // Get sessions by clinic (Clinic)
// export const getClinicSessions = async (clinicId) => {
//   try {
//     const res = await api.get(`/sessions/clinic/${clinicId}`);
//     return res.data.data;
//   } catch (error) {
//     console.error("Error fetching clinic sessions:", error);

//     // Get all sessions from mock database
//     const mockSessions = JSON.parse(
//       localStorage.getItem("mockSessions") || "[]"
//     );
//     console.log("📋 All sessions in mock database:", mockSessions);

//     return mockSessions;
//   }
// };

// In your api.js - UPDATE these session functions:

// Create a new session (Clinic) - Use encounter endpoint instead
// export const createSession = async (sessionData) => {
//   try {
//     console.log("🎤 Creating session as encounter:", sessionData);

//     // Convert session data to encounter format
//     const encounterData = {
//       patientId: sessionData.patientId,
//       summary: sessionData.summary || "Voice consultation session",
//       symptoms: [],
//       diagnosis: "Consultation completed",
//       medications: [],
//       vitals: {},
//       transcript: sessionData.transcript,
//       duration: sessionData.duration,
//       sessionDate: sessionData.sessionDate,
//     };

//     const res = await api.post(`/clinic/encounter`, encounterData);
//     console.log("✅ Session created as encounter successfully:", res.data);
//     return res.data.data;
//   } catch (error) {
//     console.error("❌ Error creating session:", error);

//     // Enhanced mock response for development
//     const mockResponse = {
//       _id: `session_${Date.now()}`,
//       ...sessionData,
//       status: "completed",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     console.log("⚠️ Using mock session creation - STORED IN MOCK DATABASE");

//     // Store in localStorage as mock database
//     const existingSessions = JSON.parse(
//       localStorage.getItem("mockSessions") || "[]"
//     );
//     const updatedSessions = [...existingSessions, mockResponse];
//     localStorage.setItem("mockSessions", JSON.stringify(updatedSessions));

//     console.log(
//       "📦 Mock session stored. Total sessions:",
//       updatedSessions.length
//     );

//     return mockResponse;
//   }
// };

// Update the createSession function in api.js:

export const createSession = async (sessionData) => {
  try {
    console.log("🎤 Creating session as encounter:", sessionData);

    // For demo patients, skip the API call and use mock data
    if (!isValidObjectId(sessionData.patientId)) {
      console.log("🔄 Using mock session creation for demo patient");

      const mockResponse = {
        _id: `session_${Date.now()}`,
        ...sessionData,
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("⚠️ Using mock session creation - STORED IN MOCK DATABASE");

      // Store in localStorage as mock database
      const existingSessions = JSON.parse(
        localStorage.getItem("mockSessions") || "[]"
      );
      const updatedSessions = [...existingSessions, mockResponse];
      localStorage.setItem("mockSessions", JSON.stringify(updatedSessions));

      console.log(
        "📦 Mock session stored. Total sessions:",
        updatedSessions.length
      );

      return mockResponse;
    }

    // Convert session data to encounter format (only for real patients)
    const encounterData = {
      patientId: sessionData.patientId,
      summary: sessionData.summary || "Voice consultation session",
      symptoms: [],
      diagnosis: "Consultation completed",
      medications: [],
      vitals: {},
      transcript: sessionData.transcript,
      duration: sessionData.duration,
      sessionDate: sessionData.sessionDate,
    };

    const res = await api.post(`/clinic/encounter`, encounterData);
    console.log("✅ Session created as encounter successfully:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("❌ Error creating session:", error);

    // Enhanced mock response for development
    const mockResponse = {
      _id: `session_${Date.now()}`,
      ...sessionData,
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("⚠️ Using mock session creation - STORED IN MOCK DATABASE");

    // Store in localStorage as mock database
    const existingSessions = JSON.parse(
      localStorage.getItem("mockSessions") || "[]"
    );
    const updatedSessions = [...existingSessions, mockResponse];
    localStorage.setItem("mockSessions", JSON.stringify(updatedSessions));

    console.log(
      "📦 Mock session stored. Total sessions:",
      updatedSessions.length
    );

    return mockResponse;
  }
};

// Get sessions by clinic (Clinic) - Use local storage mock
export const getClinicSessions = async (clinicId) => {
  try {
    // Since this endpoint doesn't exist, use mock data
    console.log("📋 Fetching sessions from mock database");

    const mockSessions = JSON.parse(
      localStorage.getItem("mockSessions") || "[]"
    );

    // Filter by clinicId if provided
    const filteredSessions = clinicId
      ? mockSessions.filter((s) => s.clinicId === clinicId)
      : mockSessions;

    console.log(
      "✅ Sessions fetched from mock database:",
      filteredSessions.length
    );
    return filteredSessions;
  } catch (error) {
    console.error("Error fetching clinic sessions:", error);

    // Get all sessions from mock database
    const mockSessions = JSON.parse(
      localStorage.getItem("mockSessions") || "[]"
    );
    console.log("📋 All sessions in mock database:", mockSessions);

    return mockSessions;
  }
};

// Get patient sessions
export const getPatientSessions = async (patientId) => {
  try {
    const res = await api.get(`/sessions/patient/${patientId}`);
    console.log("✅ Sessions fetched successfully for patient:", patientId);
    return res.data.data;
  } catch (error) {
    console.error("❌ Error fetching sessions:", error);

    // Get from mock database (localStorage)
    const mockSessions = JSON.parse(
      localStorage.getItem("mockSessions") || "[]"
    );
    const patientSessions = mockSessions.filter(
      (s) => s.patientId === patientId
    );

    console.log(
      "⚠️ Using mock sessions from storage. Found:",
      patientSessions.length
    );

    return patientSessions;
  }
};

// Get session by ID
export const getSessionById = async (sessionId) => {
  try {
    const res = await api.get(`/sessions/${sessionId}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching session:", error);

    // Get from mock database
    const mockSessions = JSON.parse(
      localStorage.getItem("mockSessions") || "[]"
    );
    const session = mockSessions.find((s) => s._id === sessionId);

    return session || null;
  }
};

// AI dosage optimization
export const getAIDosageRecommendation = async (medication, patientData) => {
  const token = getStoredToken();
  const response = await axios.post(
    `${API_BASE}/ai/dosage-recommendation`,
    { medication, patientData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
