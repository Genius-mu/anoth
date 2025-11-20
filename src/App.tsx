import { useState } from 'react';
import LandingPage from './components/LandingPage';
import PatientDashboard from './components/PatientDashboard';
import ClinicDashboard from './components/ClinicDashboard';
import PatientOnboarding from './components/PatientOnboarding';
import ClinicOnboarding from './components/ClinicOnboarding';
import Login from './components/Login';

type Page = 'landing' | 'login' | 'patient-onboarding' | 'clinic-onboarding' | 'patient-dashboard' | 'clinic-dashboard';
type UserType = 'patient' | 'clinic' | null;

interface User {
  type: 'patient' | 'clinic';
  name: string;
  dob?: string;
  email?: string;
  hospital?: string;
  subscriptionTier?: 'free' | 'premium';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [pendingUserType, setPendingUserType] = useState<UserType>(null);

  const handlePatientSignup = () => {
    setPendingUserType('patient');
    setCurrentPage('patient-onboarding');
  };

  const handleClinicSignup = () => {
    setPendingUserType('clinic');
    setCurrentPage('clinic-onboarding');
  };

  const handleLogin = (userType: UserType) => {
    setPendingUserType(userType);
    setCurrentPage('login');
  };

  const handleLoginComplete = (data: { email: string; userType: 'patient' | 'clinic' }) => {
    // Simulate login - in real app, this would verify credentials
    if (data.userType === 'patient') {
      setUser({
        type: 'patient',
        name: 'John Doe',
        dob: '1980-05-15',
        email: data.email,
        subscriptionTier: 'free'
      });
      setCurrentPage('patient-dashboard');
    } else {
      setUser({
        type: 'clinic',
        name: 'Dr. Sarah Johnson',
        email: data.email,
        hospital: 'City General Hospital',
        subscriptionTier: 'premium'
      });
      setCurrentPage('clinic-dashboard');
    }
  };

  const handlePatientOnboardingComplete = (data: { name: string; dob: string; email: string }) => {
    setUser({
      type: 'patient',
      name: data.name,
      dob: data.dob,
      email: data.email,
      subscriptionTier: 'free'
    });
    setCurrentPage('patient-dashboard');
  };

  const handleClinicOnboardingComplete = (data: { name: string; hospital: string; email: string }) => {
    setUser({
      type: 'clinic',
      name: data.name,
      email: data.email,
      hospital: data.hospital,
      subscriptionTier: 'premium'
    });
    setCurrentPage('clinic-dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setUser(null);
    setPendingUserType(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F6FA' }}>
      {currentPage === 'landing' && (
        <LandingPage 
          onPatientSignup={handlePatientSignup}
          onClinicSignup={handleClinicSignup}
          onLogin={handleLogin}
        />
      )}
      {currentPage === 'login' && (
        <Login 
          userType={pendingUserType}
          onComplete={handleLoginComplete}
          onBack={handleBackToLanding}
          onSignup={() => {
            if (pendingUserType === 'patient') {
              handlePatientSignup();
            } else {
              handleClinicSignup();
            }
          }}
        />
      )}
      {currentPage === 'patient-onboarding' && (
        <PatientOnboarding 
          onComplete={handlePatientOnboardingComplete}
          onBack={handleBackToLanding}
        />
      )}
      {currentPage === 'clinic-onboarding' && (
        <ClinicOnboarding 
          onComplete={handleClinicOnboardingComplete}
          onBack={handleBackToLanding}
        />
      )}
      {currentPage === 'patient-dashboard' && user && (
        <PatientDashboard 
          user={user}
          onLogout={handleBackToLanding}
        />
      )}
      {currentPage === 'clinic-dashboard' && user && (
        <ClinicDashboard 
          user={user}
          onLogout={handleBackToLanding}
        />
      )}
    </div>
  );
}