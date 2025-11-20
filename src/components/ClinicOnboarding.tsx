import { useState } from 'react';
import { ArrowLeft, User, Building2, CheckCircle, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logo from 'figma:asset/eb6d15466f76858f9aa3d9535154b129bc9f0c63.png';

interface ClinicOnboardingProps {
  onComplete: (data: { name: string; hospital: string; email: string }) => void;
  onBack: () => void;
}

export default function ClinicOnboarding({ onComplete, onBack }: ClinicOnboardingProps) {
  const [formData, setFormData] = useState({
    name: '',
    hospital: '',
    email: ''
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  const isValid = formData.name && formData.hospital && formData.email;

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
                Clinic Registration
              </h1>
            </div>
          </div>
          <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '16px' }}>
            Set up your clinic account to access patient records and AI-powered insights
          </p>
        </div>

        {/* Form */}
        <div className="p-8 rounded-xl mb-8" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="mb-2 flex items-center gap-2">
                <User className="w-4 h-4" style={{ color: '#1B4F72' }} />
                <span style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Doctor Name *</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Jane Smith"
                className="rounded-lg border-2"
                style={{ borderColor: '#E8F4F8' }}
              />
            </div>
            <div>
              <Label htmlFor="hospital" className="mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" style={{ color: '#1B4F72' }} />
                <span style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Hospital/Clinic Affiliation *</span>
              </Label>
              <Input
                id="hospital"
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                placeholder="City General Hospital"
                className="rounded-lg border-2"
                style={{ borderColor: '#E8F4F8' }}
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: '#1B4F72' }} />
                <span style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Email Address *</span>
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane.smith@example.com"
                className="rounded-lg border-2"
                style={{ borderColor: '#E8F4F8' }}
              />
            </div>
          </div>
          
          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full rounded-lg py-6"
              style={{ 
                fontFamily: 'Poppins',
                backgroundColor: isValid ? '#0A3D62' : '#E8F4F8',
                color: isValid ? '#FFFFFF' : '#1B4F72'
              }}
            >
              Complete Registration
            </Button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="p-8 rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}>
          <h3 className="mb-4" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>
            What You'll Get
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#0A3D62' }} />
              <div>
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Access patient records with consent</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#0A3D62' }} />
              <div>
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Voice-to-EMR consultation recording</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#0A3D62' }} />
              <div>
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>AI-powered prescription risk analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#0A3D62' }} />
              <div>
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Real-time patient symptom monitoring</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#0A3D62' }} />
              <div>
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72' }}>Emergency access capabilities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}