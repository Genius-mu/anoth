import { useState } from "react";
import {
  ArrowLeft,
  User,
  Building2,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import logo from "figma:asset/eb6d15466f76858f9aa3d9535154b129bc9f0c63.png";

interface ClinicOnboardingProps {
  onComplete: (data: {
    name: string;
    password: string;
    hospital: string;
    email: string;
    gender: string;
    phone: string;
  }) => void;
  onBack: () => void;
}

export default function ClinicOnboarding({
  onComplete,
  onBack,
}: ClinicOnboardingProps) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    hospital: "",
    email: "",
    gender: "",
    countryCode: "+234",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://dosewise-2p1n.onrender.com/api/auth/clinic/register",
        {
          name: formData.name,
          email: formData.email,
          password: "securepass123",
          hospital: formData.hospital,
          gender: formData.gender,
          phone: formData.countryCode + formData.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_MEDICAL_API_KEY}`,
          },
        }
      );

      console.log("Clinic registered:", response.data);
      onComplete(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    formData.name &&
    formData.password &&
    formData.hospital &&
    formData.email &&
    formData.gender &&
    formData.phone;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-6 transition-colors"
            style={{ color: "#1B4F72" }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: "Roboto" }}>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logo}
              alt="Dosewise Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1
                style={{
                  fontFamily: "Nunito Sans",
                  color: "#0A3D62",
                  fontSize: "32px",
                }}
              >
                Clinic Registration
              </h1>
            </div>
          </div>
          <p
            style={{ fontFamily: "Roboto", color: "#1B4F72", fontSize: "16px" }}
          >
            Set up your clinic account to access patient records and AI-powered
            insights
          </p>
        </div>

        {/* Form */}
        <div
          className="p-8 rounded-xl mb-8"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 16px rgba(10, 61, 98, 0.08)",
          }}
        >
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="mb-2 flex items-center gap-2">
                <User className="w-4 h-4" style={{ color: "#1B4F72" }} />
                <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Doctor Name *
                </span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Dr. Jane Smith"
                className="rounded-lg border-2"
                style={{ borderColor: "#E8F4F8" }}
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="mb-2 flex items-center gap-2"
              >
                <User className="w-4 h-4" style={{ color: "#1B4F72" }} />
                <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Password *
                </span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter a secure password"
                className="rounded-lg border-2"
                style={{ borderColor: "#E8F4F8" }}
              />
            </div>
            <div>
              <Label
                htmlFor="hospital"
                className="mb-2 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" style={{ color: "#1B4F72" }} />
                <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Hospital/Clinic Affiliation *
                </span>
              </Label>
              <Input
                id="hospital"
                value={formData.hospital}
                onChange={(e) =>
                  setFormData({ ...formData, hospital: e.target.value })
                }
                placeholder="City General Hospital"
                className="rounded-lg border-2"
                style={{ borderColor: "#E8F4F8" }}
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: "#1B4F72" }} />
                <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Email Address *
                </span>
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="jane.smith@example.com"
                className="rounded-lg border-2"
                style={{ borderColor: "#E8F4F8" }}
              />
            </div>
            <div>
              <Label htmlFor="gender" className="mb-2 flex items-center gap-2">
                <User className="w-4 h-4" style={{ color: "#1B4F72" }} />
                <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Gender *
                </span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                className="w-full"
              >
                <SelectTrigger
                  className="rounded-lg border-2"
                  style={{ borderColor: "#E8F4F8" }}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" style={{ color: "#1B4F72" }} />
                <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Phone Number *
                </span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, countryCode: value })
                  }
                >
                  <SelectTrigger
                    className="w-32 rounded-lg border-2"
                    style={{ borderColor: "#E8F4F8" }}
                  >
                    <SelectValue placeholder="+234" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+234">🇳🇬 +234</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+27">🇿🇦 +27</SelectItem>
                    <SelectItem value="+254">🇰🇪 +254</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="8012345678"
                  className="flex-1 rounded-lg border-2"
                  style={{ borderColor: "#E8F4F8" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full rounded-lg py-6"
              style={{
                fontFamily: "Poppins",
                backgroundColor: isValid ? "#0A3D62" : "#E8F4F8",
                color: isValid ? "#FFFFFF" : "#1B4F72",
              }}
            >
              Complete Registration
            </Button>
          </div>
        </div>

        {/* Features Preview */}
        <div
          className="p-8 rounded-xl"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 16px rgba(10, 61, 98, 0.08)",
          }}
        >
          <h3
            className="mb-4"
            style={{
              fontFamily: "Nunito Sans",
              color: "#0A3D62",
              fontSize: "20px",
            }}
          >
            What You'll Get
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-1"
                style={{ color: "#0A3D62" }}
              />
              <div>
                <p style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Access patient records with consent
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-1"
                style={{ color: "#0A3D62" }}
              />
              <div>
                <p style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Voice-to-EMR consultation recording
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-1"
                style={{ color: "#0A3D62" }}
              />
              <div>
                <p style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  AI-powered prescription risk analysis
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-1"
                style={{ color: "#0A3D62" }}
              />
              <div>
                <p style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Real-time patient symptom monitoring
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-1"
                style={{ color: "#0A3D62" }}
              />
              <div>
                <p style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                  Emergency access capabilities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
