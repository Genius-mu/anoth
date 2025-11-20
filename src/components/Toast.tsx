import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: '#F0FDF4',
      border: '#4ADE80',
      icon: '#16A34A',
      Icon: CheckCircle
    },
    error: {
      bg: '#FFF5F5',
      border: '#FF6F61',
      icon: '#FF6F61',
      Icon: AlertCircle
    },
    info: {
      bg: '#F0F9FF',
      border: '#0A3D62',
      icon: '#1B4F72',
      Icon: Info
    }
  };

  const style = styles[type];
  const IconComponent = style.Icon;

  return (
    <div 
      className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-2 max-w-md"
      style={{
        backgroundColor: style.bg,
        border: `2px solid ${style.border}`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 32px rgba(10, 61, 98, 0.16)'
      }}
    >
      <div className="flex items-start gap-3">
        <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: style.icon }} />
        <p className="flex-1" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
          {message}
        </p>
        <button 
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" style={{ color: '#1B4F72' }} />
        </button>
      </div>
    </div>
  );
}
