import { useState } from 'react';
import { ArrowLeft, Upload, User, Mail, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logo from 'figma:asset/eb6d15466f76858f9aa3d9535154b129bc9f0c63.png';

interface PatientOnboardingProps {
  onComplete: (data: { name: string; dob: string; email: string }) => void;
  onBack: () => void;
}

export default function PatientOnboarding({ onComplete, onBack }: PatientOnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onComplete(formData);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const isStep1Valid = formData.name && formData.dob && formData.email;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 mb-6 transition-colors"
            style={{ color: '#1B4F72' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: 'Roboto' }}>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Dosewise Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '32px' }}>
                Welcome to Dosewise
              </h1>
            </div>
          </div>
          <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '16px' }}>
            Let's set up your account in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div 
              className="h-2 rounded-full flex-1 transition-all"
              style={{ backgroundColor: step >= 1 ? '#0A3D62' : '#E8F4F8' }}
            />
            <div 
              className="h-2 rounded-full flex-1 transition-all"
              style={{ backgroundColor: step >= 2 ? '#0A3D62' : '#E8F4F8' }}
            />
          </div>
          <div className="flex justify-between">
            <span style={{ fontFamily: 'Lato', color: '#1B4F72', fontSize: '14px' }}>Basic Info</span>
            <span style={{ fontFamily: 'Lato', color: '#1B4F72', fontSize: '14px' }}>Medical Records</span>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="p-8 rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}>
            <h2 className="mb-6" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: '#1B4F72' }} />
                  <span style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Full Name *</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="rounded-lg border-2"
                  style={{ borderColor: '#E8F4F8' }}
                />
              </div>
              <div>
                <Label htmlFor="dob" className="mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: '#1B4F72' }} />
                  <span style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Date of Birth *</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="rounded-lg border-2"
                  style={{ borderColor: '#E8F4F8' }}
                />
                <p className="mt-2" style={{ fontFamily: 'Lato', color: '#1B4F72', fontSize: '12px' }}>
                  Required for emergency access
                </p>
              </div>
              <div>
                <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: '#1B4F72' }} />
                  <span style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Email Address *</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  className="rounded-lg border-2"
                  style={{ borderColor: '#E8F4F8' }}
                />
              </div>
            </div>
            <div className="mt-8">
              <Button
                onClick={handleNext}
                disabled={!isStep1Valid}
                className="w-full rounded-lg py-6"
                style={{ 
                  fontFamily: 'Poppins',
                  backgroundColor: isStep1Valid ? '#0A3D62' : '#E8F4F8',
                  color: isStep1Valid ? '#FFFFFF' : '#1B4F72'
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Medical Records Upload */}
        {step === 2 && (
          <div className="p-8 rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}>
            <h2 className="mb-6" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
              Upload Medical Records (Optional)
            </h2>
            <p className="mb-6" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
              Upload any existing medical records, prescriptions, or lab results. Our AI will automatically extract and organize the information.
            </p>
            
            <div 
              className="border-2 border-dashed rounded-xl p-12 text-center mb-6 transition-colors hover:border-opacity-100"
              style={{ borderColor: '#E8F4F8', backgroundColor: '#F2F6FA' }}
            >
              <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: '#1B4F72' }} />
              <p className="mb-2" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62' }}>
                Drag and drop files here
              </p>
              <p className="mb-4" style={{ fontFamily: 'Lato', color: '#1B4F72', fontSize: '14px' }}>
                or
              </p>
              <label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span 
                  className="inline-block px-6 py-3 rounded-lg cursor-pointer"
                  style={{ 
                    fontFamily: 'Poppins',
                    backgroundColor: '#E8F4F8',
                    color: '#0A3D62'
                  }}
                >
                  Browse Files
                </span>
              </label>
              <p className="mt-4" style={{ fontFamily: 'Lato', color: '#1B4F72', fontSize: '12px' }}>
                Supported formats: PDF, JPG, PNG, CSV
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '16px' }}>
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg flex items-center gap-3"
                      style={{ backgroundColor: '#F2F6FA' }}
                    >
                      <Upload className="w-4 h-4" style={{ color: '#1B4F72' }} />
                      <span style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 rounded-lg py-6 border-2"
                style={{ 
                  fontFamily: 'Poppins',
                  borderColor: '#1B4F72',
                  color: '#1B4F72'
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 rounded-lg py-6"
                style={{ 
                  fontFamily: 'Poppins',
                  backgroundColor: '#0A3D62',
                  color: '#FFFFFF'
                }}
              >
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}