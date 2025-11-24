import { useState } from "react";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import axios from "axios";
import { storeToken } from "./api/api";
import logo from "figma:asset/eb6d15466f76858f9aa3d9535154b129bc9f0c63.png";

interface LoginProps {
  userType: "patient" | "clinic" | null;
  onComplete: (data: {
    email: string;
    userType: "patient" | "clinic";
    token: string;
    userId: string;
    name: string;
  }) => void;
  onBack: () => void;
  onSignup: () => void;
}

export default function Login({
  userType,
  onComplete,
  onBack,
  onSignup,
}: LoginProps) {
  const [activeTab, setActiveTab] = useState<"patient" | "clinic">(
    userType || "patient"
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const body = {
        email: formData.email,
        password: formData.password,
        userType: activeTab,
      };

      console.log("🔐 Attempting login:", {
        email: formData.email,
        userType: activeTab,
      });

      // Use the correct endpoint structure from the API docs
      const res = await axios.post(
        "https://dosewise-2p1n.onrender.com/auth/login", // Removed /api prefix
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("✅ Login response:", res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || "Login failed");
      }

      // Extract data from response based on API docs structure
      const userData = res.data.data;
      const token = userData.token;
      const userId = userData._id;
      const userName = userData.name;

      if (!token) {
        throw new Error("No token received from server");
      }

      // Store the token properly
      storeToken(token, activeTab);

      // Also store user ID for future use
      if (activeTab === "patient") {
        localStorage.setItem("patientId", userId);
      }

      console.log("✅ Login successful:", {
        userId,
        userName,
        userType: activeTab,
        tokenPreview: token.substring(0, 20) + "...",
      });

      // Proceed to next step with complete user data
      onComplete({
        email: formData.email,
        userType: activeTab,
        token: token,
        userId: userId,
        name: userName,
      });
    } catch (err: any) {
      console.error("❌ Login error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      let errorMessage = "Login failed. Please try again.";

      if (err.response?.status === 401) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (err.response?.status === 404) {
        errorMessage = "User not found. Please check your email or sign up.";
      } else if (err.code === "NETWORK_ERROR" || err.code === "ECONNABORTED") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-6 transition-colors hover:opacity-70"
            style={{ color: "#1B4F72" }}
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: "Roboto" }}>Back</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
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
                  fontSize: "28px",
                }}
              >
                Welcome Back
              </h1>
              <p
                style={{
                  fontFamily: "Roboto",
                  color: "#1B4F72",
                  fontSize: "14px",
                }}
              >
                Sign in to your Dosewise account
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div
          className="p-8 rounded-xl"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 16px rgba(10, 61, 98, 0.08)",
          }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "patient" | "clinic")}
            className="mb-6"
          >
            <TabsList
              className="w-full grid grid-cols-2 rounded-lg p-1"
              style={{ backgroundColor: "#F2F6FA" }}
            >
              <TabsTrigger
                value="patient"
                className="rounded-lg"
                style={{ fontFamily: "Poppins" }}
                disabled={isLoading}
              >
                Patient
              </TabsTrigger>
              <TabsTrigger
                value="clinic"
                className="rounded-lg"
                style={{ fontFamily: "Poppins" }}
                disabled={isLoading}
              >
                Clinic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="email"
                    className="mb-2 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" style={{ color: "#1B4F72" }} />
                    <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                      Email Address
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your.email@example.com"
                    className="rounded-lg border-2"
                    style={{ borderColor: "#E8F4F8" }}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="password"
                    className="mb-2 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" style={{ color: "#1B4F72" }} />
                    <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                      Password
                    </span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    className="rounded-lg border-2"
                    style={{ borderColor: "#E8F4F8" }}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      disabled={isLoading}
                    />
                    <span
                      style={{
                        fontFamily: "Roboto",
                        color: "#1B4F72",
                        fontSize: "14px",
                      }}
                    >
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    style={{
                      fontFamily: "Roboto",
                      color: "#0A3D62",
                      fontSize: "14px",
                    }}
                    className="hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-lg py-6"
                  style={{
                    fontFamily: "Poppins",
                    backgroundColor: "#0A3D62",
                    color: "#FFFFFF",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In as Patient"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="clinic">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="clinic-email"
                    className="mb-2 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" style={{ color: "#1B4F72" }} />
                    <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                      Professional Email
                    </span>
                  </Label>
                  <Input
                    id="clinic-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="doctor@hospital.com"
                    className="rounded-lg border-2"
                    style={{ borderColor: "#E8F4F8" }}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="clinic-password"
                    className="mb-2 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" style={{ color: "#1B4F72" }} />
                    <span style={{ fontFamily: "Roboto", color: "#1B4F72" }}>
                      Password
                    </span>
                  </Label>
                  <Input
                    id="clinic-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    className="rounded-lg border-2"
                    style={{ borderColor: "#E8F4F8" }}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      disabled={isLoading}
                    />
                    <span
                      style={{
                        fontFamily: "Roboto",
                        color: "#1B4F72",
                        fontSize: "14px",
                      }}
                    >
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    style={{
                      fontFamily: "Roboto",
                      color: "#0A3D62",
                      fontSize: "14px",
                    }}
                    className="hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-lg py-6"
                  style={{
                    fontFamily: "Poppins",
                    backgroundColor: "#0A3D62",
                    color: "#FFFFFF",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In as Clinician"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p
              style={{
                fontFamily: "Roboto",
                color: "#1B4F72",
                fontSize: "14px",
              }}
            >
              Don't have an account?{" "}
              <button
                onClick={onSignup}
                style={{
                  fontFamily: "Roboto",
                  color: "#0A3D62",
                  fontSize: "14px",
                  textDecoration: "underline",
                }}
                className="hover:opacity-70"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div
          className="mt-6 p-4 rounded-lg"
          style={{ backgroundColor: "#F0F9FF" }}
        >
          <p
            style={{
              fontFamily: "Lato",
              color: "#1B4F72",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            🔒 Your data is encrypted and HIPAA compliant
          </p>
        </div>
      </div>
    </div>
  );
}
