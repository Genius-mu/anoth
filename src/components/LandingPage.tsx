import {
  Heart,
  Shield,
  Mic,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import logo from "figma:asset/eb6d15466f76858f9aa3d9535154b129bc9f0c63.png";
import { motion } from "framer-motion";

interface LandingPageProps {
  onPatientSignup: () => void;
  onClinicSignup: () => void;
  onLogin: (userType: "patient" | "clinic" | null) => void;
}

export default function LandingPage({
  onPatientSignup,
  onClinicSignup,
  onLogin,
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2F6FA" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(10, 61, 98, 0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Dosewise Logo"
                className="w-10 h-10 object-contain"
              />
              <span
                className="text-2xl"
                style={{ fontFamily: "Nunito Sans", color: "#0A3D62" }}
              >
                Dosewise
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="transition-colors hover:scale-105"
                style={{ fontFamily: "Roboto", color: "#1B4F72" }}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="transition-colors hover:scale-105"
                style={{ fontFamily: "Roboto", color: "#1B4F72" }}
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="transition-colors hover:scale-105"
                style={{ fontFamily: "Roboto", color: "#1B4F72" }}
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="transition-colors hover:scale-105"
                style={{ fontFamily: "Roboto", color: "#1B4F72" }}
              >
                Contact
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => onLogin(null)}
                className="border-2 rounded-lg cursor-pointer hover:scale-105"
                style={{
                  fontFamily: "Poppins",
                  borderColor: "#0A3D62",
                  color: "#0A3D62",
                }}
              >
                Sign In
              </Button>
              <Button
                onClick={onPatientSignup}
                className="rounded-lg cursor-pointer hover:scale-105"
                style={{
                  fontFamily: "Poppins",
                  backgroundColor: "#0A3D62",
                  color: "#FFFFFF",
                }}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2">
              <nav className="flex flex-col gap-4">
                <a
                  href="#features"
                  className="py-2"
                  style={{ fontFamily: "Roboto", color: "#1B4F72" }}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="py-2"
                  style={{ fontFamily: "Roboto", color: "#1B4F72" }}
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  className="py-2"
                  style={{ fontFamily: "Roboto", color: "#1B4F72" }}
                >
                  Pricing
                </a>
                <a
                  href="#contact"
                  className="py-2"
                  style={{ fontFamily: "Roboto", color: "#1B4F72" }}
                >
                  Contact
                </a>
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="outline" onClick={() => onLogin(null)}>
                    Sign In
                  </Button>
                  <Button onClick={onPatientSignup}>Get Started</Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: "#E8F4F8",
                border: "1px solid #0A3D62",
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#0A3D62" }}
              ></div>
              <motion.span
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
                style={{
                  fontFamily: "Roboto",
                  color: "#0A3D62",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Powered by Dorra EMR & PharmaVigilance APIs
              </motion.span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
              className="mb-6"
              style={{
                fontFamily: "Nunito Sans",
                color: "#0A3D62",
                fontSize: "48px",
                lineHeight: "1.2",
              }}
            >
              Personalized Care, Safer Decisions, Powered by Smarter Records.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              className="mb-8"
              style={{
                fontFamily: "Roboto",
                color: "#1B4F72",
                fontSize: "18px",
                lineHeight: "1.6",
              }}
            >
              Dosewise uses AI to help you and your clinician verify medication
              compatibility, manage prescriptions, track symptoms, and access
              medical records from anywhere — safely and intelligently.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onPatientSignup}
                className="px-8 py-6 rounded-lg"
                style={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  backgroundColor: "#0A3D62",
                  color: "#FFFFFF",
                }}
              >
                I'm a Patient
              </Button>
              <Button
                onClick={onClinicSignup}
                variant="outline"
                className="px-8 py-6 rounded-lg border-2"
                style={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  borderColor: "#0A3D62",
                  color: "#0A3D62",
                }}
              >
                I'm a Clinician
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZG9jdG9yJTIwaGVhbHRoY2FyZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYzNjM1MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="African healthcare professional using digital medical technology"
              className="rounded-2xl shadow-2xl w-full h-[450px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="px-6 py-20"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-center mb-16"
            style={{
              fontFamily: "Nunito Sans",
              color: "#0A3D62",
              fontSize: "40px",
            }}
          >
            Powerful Features for Safer Healthcare
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={
                <Shield className="w-12 h-12" style={{ color: "#0A3D62" }} />
              }
              title="AI-Powered Prescription Safety"
              description="Automatically checks new prescriptions against your medical history. Flags adverse reactions and provides actionable recommendations."
            />
            <FeatureCard
              icon={
                <AlertCircle
                  className="w-12 h-12"
                  style={{ color: "#0A3D62" }}
                />
              }
              title="Symptom Tracking & Notifications"
              description="Log symptoms post-medication. AI evaluates trends and alerts you and your clinician if something is abnormal."
            />
            <FeatureCard
              icon={<Mic className="w-12 h-12" style={{ color: "#0A3D62" }} />}
              title="Voice-Driven Medical Records"
              description="Record consultations and automatically generate EMR entries. Reduce manual data entry and keep your history up-to-date."
            />
            <FeatureCard
              icon={
                <Heart className="w-12 h-12" style={{ color: "#0A3D62" }} />
              }
              title="Emergency Access"
              description="Secure, consent-driven emergency access using Name + DOB. Future-ready for biometric or wearable solutions."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-center mb-16"
            style={{
              fontFamily: "Nunito Sans",
              color: "#0A3D62",
              fontSize: "40px",
            }}
          >
            How It Works
          </h2>

          {/* Patient Flow */}
          <div className="mb-16">
            <h3
              className="mb-8"
              style={{
                fontFamily: "Nunito Sans",
                color: "#1B4F72",
                fontSize: "28px",
              }}
            >
              For Patients
            </h3>
            <div className="grid md:grid-cols-5 gap-6">
              <StepCard
                number="01"
                title="Sign Up"
                description="Register with name, DOB, and email"
              />
              <StepCard
                number="02"
                title="Upload Records"
                description="Add existing records or record new consultation"
              />
              <StepCard
                number="03"
                title="Check Prescriptions"
                description="Verify medication compatibility"
              />
              <StepCard
                number="04"
                title="Track Symptoms"
                description="Log and monitor symptoms"
              />
              <StepCard
                number="05"
                title="Share Access"
                description="Grant access to your clinicians"
              />
            </div>
          </div>

          {/* Clinician Flow */}
          <div>
            <h3
              className="mb-8"
              style={{
                fontFamily: "Nunito Sans",
                color: "#1B4F72",
                fontSize: "28px",
              }}
            >
              For Clinicians
            </h3>
            <div className="grid md:grid-cols-5 gap-6">
              <StepCard
                number="01"
                title="Sign Up"
                description="Register with name and hospital affiliation"
              />
              <StepCard
                number="02"
                title="Access Records"
                description="View patient records with consent"
              />
              <StepCard
                number="03"
                title="Record Sessions"
                description="Voice or manual consultation entry"
              />
              <StepCard
                number="04"
                title="AI Analysis"
                description="Receive prescription risk alerts"
              />
              <StepCard
                number="05"
                title="Monitor Patients"
                description="Track symptoms and provide recommendations"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-center mb-16"
            style={{
              fontFamily: "Nunito Sans",
              color: "#0A3D62",
              fontSize: "40px",
            }}
          >
            Trusted by Patients and Clinicians
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="Dosewise saved me from a potential allergic reaction. The AI flagged an interaction my pharmacy didn't catch."
              author="Sarah M."
              role="Patient"
            />
            <TestimonialCard
              quote="Clinicians can make faster, safer decisions with all patient history in one place. It's transformed our practice."
              author="Dr. James Chen"
              role="Family Medicine Physician"
            />
          </div>
          <div className="flex justify-center gap-12 mt-12 flex-wrap">
            <div
              className="px-6 py-3 rounded-lg"
              style={{ backgroundColor: "#E8F4F8" }}
            >
              <p style={{ fontFamily: "Poppins", color: "#1B4F72" }}>
                PharmaVigilance API
              </p>
            </div>
            <div
              className="px-6 py-3 rounded-lg"
              style={{ backgroundColor: "#E8F4F8" }}
            >
              <p style={{ fontFamily: "Poppins", color: "#1B4F72" }}>
                Dorra EMR API
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="pricing"
        className="px-6 py-20"
        style={{
          background: "linear-gradient(135deg, #0A3D62 0%, #1B4F72 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="mb-6"
            style={{
              fontFamily: "Nunito Sans",
              color: "#FFFFFF",
              fontSize: "40px",
            }}
          >
            Start Your Safer Care Journey Today
          </h2>
          <p
            className="mb-8"
            style={{ fontFamily: "Roboto", color: "#EAEFF2", fontSize: "18px" }}
          >
            Join thousands of patients and clinicians who trust Dosewise for
            smarter healthcare decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onPatientSignup}
              className="rounded-lg px-8 py-6"
              style={{
                fontFamily: "Poppins",
                backgroundColor: "#FFFFFF",
                color: "#0A3D62",
              }}
            >
              Sign Up as Patient
            </Button>
            <Button
              onClick={onClinicSignup}
              variant="outline"
              className="rounded-lg px-8 py-6 border-2"
              style={{
                fontFamily: "Poppins",
                borderColor: "#FFFFFF",
                color: "#FFFFFF",
                backgroundColor: "transparent",
              }}
            >
              Sign Up as Clinic
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="px-6 py-12"
        style={{ backgroundColor: "#0A3D62" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6" style={{ color: "#FFFFFF" }} />
                <span style={{ fontFamily: "Nunito Sans", color: "#FFFFFF" }}>
                  Dosewise
                </span>
              </div>
              <p
                style={{
                  fontFamily: "Roboto",
                  color: "#EAEFF2",
                  fontSize: "14px",
                }}
              >
                Personalized care, safer decisions, powered by smarter records.
              </p>
            </div>
            <div>
              <h4
                className="mb-4"
                style={{ fontFamily: "Nunito Sans", color: "#FFFFFF" }}
              >
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    style={{
                      fontFamily: "Roboto",
                      color: "#EAEFF2",
                      fontSize: "14px",
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    style={{
                      fontFamily: "Roboto",
                      color: "#EAEFF2",
                      fontSize: "14px",
                    }}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      fontFamily: "Roboto",
                      color: "#EAEFF2",
                      fontSize: "14px",
                    }}
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className="mb-4"
                style={{ fontFamily: "Nunito Sans", color: "#FFFFFF" }}
              >
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    style={{
                      fontFamily: "Roboto",
                      color: "#EAEFF2",
                      fontSize: "14px",
                    }}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      fontFamily: "Roboto",
                      color: "#EAEFF2",
                      fontSize: "14px",
                    }}
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      fontFamily: "Roboto",
                      color: "#EAEFF2",
                      fontSize: "14px",
                    }}
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className="mb-4"
                style={{ fontFamily: "Nunito Sans", color: "#FFFFFF" }}
              >
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    style={{
                      fontFamily: "Roboto",
                      color: "#EAEFF2",
                      fontSize: "14px",
                    }}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      fontFamily: "Roboto",
                      color: "#EAEFF2",
                      fontSize: "14px",
                    }}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      fontFamily: "Roboto",
                      color: "#EAEFF2",
                      fontSize: "14px",
                    }}
                  >
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="pt-8 border-t"
            style={{ borderColor: "rgba(234, 239, 242, 0.2)" }}
          >
            <p
              className="text-center"
              style={{
                fontFamily: "Roboto",
                color: "#EAEFF2",
                fontSize: "14px",
              }}
            >
              © 2025 Dosewise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}) {
  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: i * 0.2 }, // stagger using index
    }),
  };

  return (
    <motion.div
      variants={cardVariant} // assign the variant
      custom={index}
      initial="hidden" // initial state
      whileInView="visible" // animate when in viewport
      viewport={{ once: false, amount: 0.3 }}
      className="p-8 rounded-xl transition-all hover:scale-105"
      style={{
        backgroundColor: "#F2F6FA",
        boxShadow: "0 4px 16px rgba(10, 61, 98, 0.08)",
      }}
    >
      <div className="mb-4">{icon}</div>
      <h3
        className="mb-3"
        style={{
          fontFamily: "Nunito Sans",
          color: "#0A3D62",
          fontSize: "20px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "Roboto",
          color: "#1B4F72",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  const cardVariants = {
    hiddenLeft: { opacity: 0, x: -100, scale: 0.9 },
    hiddenRight: { opacity: 0, x: 100, scale: 0.9 },
    hiddenUp: { opacity: 0, y: 100, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  return (
    <motion.div
      variants={cardVariants}
      initial="hiddenUp"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ delay: 0.1 }}
      className="p-6 rounded-xl"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 16px rgba(10, 61, 98, 0.08)",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "#E8F4F8" }}
      >
        <span
          style={{ fontFamily: "Poppins", color: "#0A3D62", fontSize: "18px" }}
        >
          {number}
        </span>
      </div>
      <h4
        className="mb-2"
        style={{
          fontFamily: "Nunito Sans",
          color: "#0A3D62",
          fontSize: "18px",
        }}
      >
        {title}
      </h4>
      <p style={{ fontFamily: "Lato", color: "#1B4F72", fontSize: "14px" }}>
        {description}
      </p>
    </motion.div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div
      className="p-8 rounded-xl"
      style={{
        backgroundColor: "#F2F6FA",
        boxShadow: "0 4px 16px rgba(10, 61, 98, 0.08)",
      }}
    >
      <CheckCircle className="w-8 h-8 mb-4" style={{ color: "#0A3D62" }} />
      <p
        className="mb-6"
        style={{
          fontFamily: "Roboto",
          color: "#1B4F72",
          fontSize: "16px",
          lineHeight: "1.6",
        }}
      >
        "{quote}"
      </p>
      <div>
        <p
          style={{
            fontFamily: "Nunito Sans",
            color: "#0A3D62",
            fontSize: "16px",
          }}
        >
          {author}
        </p>
        <p style={{ fontFamily: "Roboto", color: "#1B4F72", fontSize: "14px" }}>
          {role}
        </p>
      </div>
    </div>
  );
}
