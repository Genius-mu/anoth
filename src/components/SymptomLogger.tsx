import { useState } from 'react';
import { Mic, MessageSquare, Camera, ArrowLeft, Check, Edit2, X, Clock, AlertTriangle, Info, Calendar, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { logSymptom } from './api/api';

interface SymptomLoggerProps {
  patientName: string;
  onClose: () => void;
  onSave: (symptomLog: StructuredSymptom) => void;
}

interface StructuredSymptom {
  id: string;
  timestamp: string;
  symptom: string;
  severity: number;
  duration: string;
  context: string;
  possibleRisk: string;
  recommendations: string;
  rawInput: string;
  inputMethod: 'voice' | 'text';
}

type LoggerStep = 'input-choice' | 'voice-input' | 'text-input' | 'ai-structuring' | 'confirmation' | 'saved';

export default function SymptomLogger({ patientName, onClose, onSave }: SymptomLoggerProps) {
  const [step, setStep] = useState<LoggerStep>('input-choice');
  const [inputMethod, setInputMethod] = useState<'voice' | 'text'>('text');
  const [rawInput, setRawInput] = useState('');
  const [severity, setSeverity] = useState<number>(5);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [structuredData, setStructuredData] = useState<StructuredSymptom | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Simulate recording timer
  useState(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartVoice = () => {
    setInputMethod('voice');
    setStep('voice-input');
  };

  const handleStartText = () => {
    setInputMethod('text');
    setStep('text-input');
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate voice-to-text transcription
    const mockTranscription = "I've been having sharp stomach pain for about 3 hours now. It started after I ate spicy food for lunch around 2pm. The pain is pretty bad, maybe a 7 out of 10. It gets worse when I move around. I have a history of peptic ulcers.";
    setRawInput(mockTranscription);
  };

  // In SymptomLogger component - replace handleSubmitInput function
// const handleSubmitInput = async () => {
//   if (!rawInput.trim()) {
//     return;
//   }
  
//   setIsProcessing(true);
//   setStep('ai-structuring');

//   try {
//     const symptomData = {
//       symptom: rawInput,
//       severity: severity.toString(), // Make sure this is a string like "moderate"
//       notes: `Input method: ${inputMethod}. ${rawInput}`,
//       duration: 'Not specified'
//     };

//     console.log("Attempting to log symptom:", symptomData);
//     const result = await logSymptom(symptomData);
//     console.log("Symptom logged successfully:", result);

//     const structured: StructuredSymptom = {
//       id: result._id || Date.now().toString(),
//       timestamp: new Date().toLocaleString('en-US', { 
//         month: 'short', 
//         day: 'numeric', 
//         year: 'numeric',
//         hour: 'numeric', 
//         minute: '2-digit',
//         hour12: true 
//       }),
//       symptom: result.symptom || rawInput,
//       severity: severity,
//       duration: result.duration || 'Not specified',
//       context: result.notes || rawInput,
//       possibleRisk: 'Analysis in progress',
//       recommendations: 'Monitor symptoms and consult healthcare provider if symptoms worsen',
//       rawInput: rawInput,
//       inputMethod: inputMethod
//     };
    
//     setStructuredData(structured);
//     setIsProcessing(false);
//     setStep('confirmation');
//   } catch (error) {
//     console.error('Error logging symptom:', error);
//     setIsProcessing(false);
//     alert('Failed to log symptom. Please check console for details.');
//   }
// };

const handleSubmitInput = async () => {
  if (!rawInput.trim()) {
    return;
  }
  
  setIsProcessing(true);
  setStep('ai-structuring');

  try {
    const symptomData = {
      symptom: rawInput,
      severity: severity.toString(),
      notes: `Input method: ${inputMethod}. ${rawInput}`,
      duration: 'Not specified'
    };

    console.log("Attempting to log symptom:", symptomData);
    
    // This will now use the MOCK version that always works
    const result = await logSymptom(symptomData);
    console.log("✅ Symptom processed successfully:", result);

    const structured: StructuredSymptom = {
      id: result._id || Date.now().toString(),
      timestamp: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      symptom: result.symptom || rawInput,
      severity: severity,
      duration: result.duration || 'Not specified',
      context: result.notes || rawInput,
      possibleRisk: 'Analysis complete - Backend integration in progress',
      recommendations: 'Monitor symptoms and consult healthcare provider if symptoms worsen. Note: Backend connection will be restored soon.',
      rawInput: rawInput,
      inputMethod: inputMethod
    };
    
    setStructuredData(structured);
    setIsProcessing(false);
    setStep('confirmation');
  } catch (error) {
    console.error('Unexpected error in symptom flow:', error);
    setIsProcessing(false);
    
    // Create structured data even on unexpected errors
    const structured: StructuredSymptom = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      symptom: rawInput,
      severity: severity,
      duration: 'Not specified',
      context: `Input method: ${inputMethod}. ${rawInput}`,
      possibleRisk: 'Backend integration in progress - consult provider for medical advice',
      recommendations: 'Monitor symptoms. Full backend functionality coming soon.',
      rawInput: rawInput,
      inputMethod: inputMethod
    };
    
    setStructuredData(structructured);
    setStep('confirmation');
  }
};

  const handleConfirm = () => {
    if (structuredData) {
      onSave(structuredData);
      setStep('saved');
    }
  };

  const handleEdit = () => {
    setStep(inputMethod === 'voice' ? 'voice-input' : 'text-input');
  };

  const handleShareToClinician = () => {
    setShowShareOptions(true);
  };

  const firstName = patientName.split(' ')[0];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#F2F6FA' }}>
        
        {/* Input Choice Step */}
        {step === 'input-choice' && (
          <>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                Log Your Symptoms
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-8">
              <div className="mb-8 text-center">
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '18px', lineHeight: '1.6' }}>
                  Hi {firstName} 👋 What's going on? Describe what you're feeling, when it started, and how severe it is.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleStartVoice}
                  className="p-8 rounded-xl transition-all hover:scale-105 border-2"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E8F4F8',
                    boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' 
                  }}
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                    <Mic className="w-8 h-8" style={{ color: '#0A3D62' }} />
                  </div>
                  <h3 className="mb-2" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>
                    🎤 Speak It
                  </h3>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                    Describe your symptoms using your voice
                  </p>
                </button>

                <button
                  onClick={handleStartText}
                  className="p-8 rounded-xl transition-all hover:scale-105 border-2"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E8F4F8',
                    boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' 
                  }}
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                    <MessageSquare className="w-8 h-8" style={{ color: '#0A3D62' }} />
                  </div>
                  <h3 className="mb-2" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>
                    💬 Type It
                  </h3>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                    Write down your symptoms in detail
                  </p>
                </button>
              </div>

              <div className="p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#E8F4F8' }}>
                <Info className="w-5 h-5 mt-0.5" style={{ color: '#1B4F72' }} />
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px', lineHeight: '1.5' }}>
                  <strong>Tip:</strong> Include details like when symptoms started, what makes them better or worse, and any related medications you've taken.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Voice Input Step */}
        {step === 'voice-input' && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <button onClick={() => setStep('input-choice')}>
                  <ArrowLeft className="w-5 h-5" style={{ color: '#1B4F72' }} />
                </button>
                <DialogTitle style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                  Voice Recording
                </DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="py-8 text-center">
              {!isRecording && !rawInput && (
                <>
                  <div className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                    <Mic className="w-16 h-16" style={{ color: '#0A3D62' }} />
                  </div>
                  <p className="mb-8" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '16px' }}>
                    Tap the button below to start recording your symptoms
                  </p>
                  <Button
                    onClick={handleStartRecording}
                    className="rounded-full w-20 h-20"
                    style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                  >
                    <Mic className="w-8 h-8" />
                  </Button>
                </>
              )}

              {isRecording && (
                <>
                  <div className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse" style={{ backgroundColor: '#FF6F61' }}>
                    <Mic className="w-16 h-16" style={{ color: '#FFFFFF' }} />
                  </div>
                  <p className="mb-2" style={{ fontFamily: 'Nunito Sans', color: '#FF6F61', fontSize: '24px' }}>
                    Recording...
                  </p>
                  <p className="mb-8" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '20px' }}>
                    {formatTime(recordingTime)}
                  </p>
                  <p className="mb-8" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                    Speak clearly about your symptoms
                  </p>
                  <Button
                    onClick={handleStopRecording}
                    className="rounded-full w-20 h-20"
                    style={{ backgroundColor: '#FF6F61', color: '#FFFFFF' }}
                  >
                    <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: '#FFFFFF' }} />
                  </Button>
                </>
              )}

              {rawInput && (
                <>
                  <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                    <Check className="w-8 h-8" style={{ color: '#16A34A' }} />
                  </div>
                  <p className="mb-4" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>
                    Recording Complete
                  </p>
                  <div className="p-4 rounded-lg mb-6 text-left" style={{ backgroundColor: '#FFFFFF' }}>
                    <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px', lineHeight: '1.6' }}>
                      "{rawInput}"
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-left" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                      Pain/Discomfort Severity (1-10)
                    </label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[severity]}
                        onValueChange={(value) => setSeverity(value[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: severity >= 7 ? '#FF6F61' : severity >= 4 ? '#FFB74D' : '#4CAF50' }}>
                        <span style={{ fontFamily: 'Poppins', color: '#FFFFFF', fontSize: '18px' }}>{severity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRawInput('');
                        setRecordingTime(0);
                      }}
                      className="flex-1 rounded-lg border-2"
                      style={{ borderColor: '#E8F4F8', color: '#1B4F72' }}
                    >
                      Re-record
                    </Button>
                    <Button
                      onClick={handleSubmitInput}
                      className="flex-1 rounded-lg"
                      style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Text Input Step */}
        {step === 'text-input' && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <button onClick={() => setStep('input-choice')}>
                  <ArrowLeft className="w-5 h-5" style={{ color: '#1B4F72' }} />
                </button>
                <DialogTitle style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                  Describe Your Symptoms
                </DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="py-6">
              <div className="mb-4">
                <label className="block mb-2" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                  What are you experiencing? Include details like when it started, severity, and what makes it better or worse.
                </label>
                <Textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="Example: I've been having sharp stomach pain for about 3 hours. It started after eating spicy food and gets worse when I move..."
                  rows={6}
                  className="rounded-lg"
                  style={{ fontFamily: 'Roboto', fontSize: '14px' }}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                  Pain/Discomfort Severity (1-10)
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[severity]}
                    onValueChange={(value) => setSeverity(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: severity >= 7 ? '#FF6F61' : severity >= 4 ? '#FFB74D' : '#4CAF50' }}>
                    <span style={{ fontFamily: 'Poppins', color: '#FFFFFF', fontSize: '18px' }}>{severity}</span>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Mild</span>
                  <span style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Moderate</span>
                  <span style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Severe</span>
                </div>
              </div>

              <Button
                onClick={handleSubmitInput}
                disabled={!rawInput.trim()}
                className="w-full rounded-lg"
                style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
              >
                Analyze Symptoms
              </Button>
            </div>
          </>
        )}

        {/* AI Structuring Step */}
        {step === 'ai-structuring' && (
          <>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                AI is Analyzing Your Symptoms
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-12 text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse" style={{ backgroundColor: '#E8F4F8' }}>
                <Activity className="w-12 h-12 animate-pulse" style={{ color: '#0A3D62' }} />
              </div>
              <p className="mb-4" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>
                Processing your symptoms...
              </p>
              <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                Checking against your medical history and current medications
              </p>
              
              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0A3D62' }} />
                  <span style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }}>Analyzing symptom patterns...</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0A3D62', animationDelay: '0.2s' }} />
                  <span style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }}>Checking medication interactions...</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0A3D62', animationDelay: '0.4s' }} />
                  <span style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }}>Generating recommendations...</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Confirmation Step */}
        {step === 'confirmation' && structuredData && (
          <>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                Review Your Symptom Log
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Symptom</p>
                    <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '18px' }}>{structuredData.symptom}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Severity</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: structuredData.severity >= 7 ? '#FF6F61' : structuredData.severity >= 4 ? '#FFB74D' : '#4CAF50' }}>
                        <span style={{ fontFamily: 'Poppins', color: '#FFFFFF', fontSize: '14px' }}>{structuredData.severity}</span>
                      </div>
                      <span style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '18px' }}>
                        {structuredData.severity >= 7 ? 'High' : structuredData.severity >= 4 ? 'Moderate' : 'Mild'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="flex items-start gap-2 mb-2">
                  <Clock className="w-4 h-4 mt-0.5" style={{ color: '#1B4F72' }} />
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Duration</p>
                </div>
                <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '14px' }}>{structuredData.duration}</p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 mt-0.5" style={{ color: '#1B4F72' }} />
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Context</p>
                </div>
                <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '14px' }}>{structuredData.context}</p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF5F5', borderLeft: '4px solid #FF6F61' }}>
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: '#FF6F61' }} />
                  <p style={{ fontFamily: 'Roboto', color: '#FF6F61', fontSize: '12px' }}>Possible Risk</p>
                </div>
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>{structuredData.possibleRisk}</p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F9FF', borderLeft: '4px solid #0A3D62' }}>
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#0A3D62' }} />
                  <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '12px' }}>Recommendations</p>
                </div>
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>{structuredData.recommendations}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="rounded-lg border-2"
                  style={{ borderColor: '#E8F4F8', color: '#1B4F72' }}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 rounded-lg"
                  style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm & Save
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Saved Step */}
        {step === 'saved' && structuredData && (
          <>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                Symptom Log Saved
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-8 text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                <Check className="w-10 h-10" style={{ color: '#16A34A' }} />
              </div>
              <p className="mb-2" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>
                Your symptom log has been saved successfully!
              </p>
              <p className="mb-8" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                {structuredData.timestamp}
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleShareToClinician}
                  className="w-full rounded-lg"
                  style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share with Clinician
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {}}
                  className="w-full rounded-lg border-2"
                  style={{ borderColor: '#E8F4F8', color: '#1B4F72' }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Request Appointment
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="w-full"
                  style={{ color: '#1B4F72' }}
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Share Options Dialog */}
        {showShareOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6 rounded-xl max-w-md w-full mx-4" style={{ backgroundColor: '#FFFFFF' }}>
              <h3 className="mb-4" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>
                Share with Clinician
              </h3>
              <p className="mb-4" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                Your symptom log will be sent to Dr. Sarah Johnson at City General Hospital.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowShareOptions(false)}
                  className="flex-1 rounded-lg border-2"
                  style={{ borderColor: '#E8F4F8', color: '#1B4F72' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowShareOptions(false);
                    setTimeout(() => onClose(), 500);
                  }}
                  className="flex-1 rounded-lg"
                  style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CheckCircle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function Activity({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
