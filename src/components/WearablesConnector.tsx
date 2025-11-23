import { useState, useEffect } from 'react';
import { Watch, Heart, Activity, Droplet, Moon, Thermometer, TrendingUp, TrendingDown, CheckCircle, AlertCircle, RefreshCw, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WearablesConnectorProps {
  onClose: () => void;
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_band' | 'health_monitor';
  brand: string;
  status: 'connected' | 'syncing' | 'disconnected';
  lastSync: string;
  battery?: number;
}

interface VitalReading {
  timestamp: string;
  value: number;
}

interface VitalsData {
  heartRate: VitalReading[];
  bloodPressure: { systolic: number; diastolic: number; timestamp: string }[];
  spO2: VitalReading[];
  temperature: VitalReading[];
  steps: VitalReading[];
  sleep: { duration: number; quality: string; timestamp: string }[];
}

export default function WearablesConnector({ onClose }: WearablesConnectorProps) {
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([
    {
      id: '1',
      name: 'Apple Watch Series 9',
      type: 'smartwatch',
      brand: 'Apple',
      status: 'connected',
      lastSync: '5 mins ago',
      battery: 78
    }
  ]);

  const [vitals, setVitals] = useState<VitalsData>({
    heartRate: [
      { timestamp: '8:00', value: 72 },
      { timestamp: '10:00', value: 68 },
      { timestamp: '12:00', value: 75 },
      { timestamp: '14:00', value: 82 },
      { timestamp: '16:00', value: 70 },
      { timestamp: 'Now', value: 74 }
    ],
    bloodPressure: [
      { systolic: 120, diastolic: 80, timestamp: '8:00 AM' },
      { systolic: 118, diastolic: 78, timestamp: '2:00 PM' }
    ],
    spO2: [
      { timestamp: '8:00', value: 98 },
      { timestamp: '12:00', value: 97 },
      { timestamp: 'Now', value: 98 }
    ],
    temperature: [
      { timestamp: '8:00', value: 36.6 },
      { timestamp: 'Now', value: 36.8 }
    ],
    steps: [
      { timestamp: 'Mon', value: 8500 },
      { timestamp: 'Tue', value: 10200 },
      { timestamp: 'Wed', value: 7800 },
      { timestamp: 'Thu', value: 9500 },
      { timestamp: 'Fri', value: 11000 },
      { timestamp: 'Sat', value: 6200 },
      { timestamp: 'Today', value: 4300 }
    ],
    sleep: [
      { duration: 7.5, quality: 'Good', timestamp: 'Last night' },
      { duration: 6.2, quality: 'Fair', timestamp: '2 nights ago' }
    ]
  });

  const [showAddDevice, setShowAddDevice] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = (deviceId: string) => {
    setIsSyncing(true);
    setConnectedDevices(devices =>
      devices.map(d =>
        d.id === deviceId ? { ...d, status: 'syncing' } : d
      )
    );

    setTimeout(() => {
      setConnectedDevices(devices =>
        devices.map(d =>
          d.id === deviceId ? { ...d, status: 'connected', lastSync: 'Just now' } : d
        )
      );
      setIsSyncing(false);
    }, 2000);
  };

  const handleDisconnectDevice = (deviceId: string) => {
    setConnectedDevices(devices => devices.filter(d => d.id !== deviceId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return '#16A34A';
      case 'syncing':
        return '#FFB74D';
      case 'disconnected':
        return '#FF6F61';
      default:
        return '#1B4F72';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#F2F6FA' }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
            Health Devices & Wearables
          </DialogTitle>
        </DialogHeader>

        {/* Connected Devices */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '18px' }}>
              Connected Devices
            </h3>
            <Button
              onClick={() => setShowAddDevice(true)}
              className="rounded-lg"
              style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          </div>

          <div className="space-y-3">
            {connectedDevices.map(device => (
              <div
                key={device.id}
                className="p-4 rounded-xl flex items-center justify-between"
                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                    <Watch className="w-6 h-6" style={{ color: '#0A3D62' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '16px' }}>
                      {device.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(device.status) }}
                      />
                      <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>
                        {device.status === 'syncing' ? 'Syncing...' : `Last sync: ${device.lastSync}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.battery && (
                    <Badge style={{ backgroundColor: '#E8F4F8', color: '#1B4F72' }}>
                      {device.battery}% 🔋
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSync(device.id)}
                    disabled={device.status === 'syncing'}
                    style={{ color: '#1B4F72' }}
                  >
                    <RefreshCw className={`w-4 h-4 ${device.status === 'syncing' ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDisconnectDevice(device.id)}
                    style={{ color: '#FF6F61' }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vitals Dashboard */}
        <div className="space-y-4">
          <h3 style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '18px' }}>
            Today's Vitals
          </h3>

          {/* Vital Cards Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <VitalCard
              icon={<Heart />}
              title="Heart Rate"
              value="74"
              unit="bpm"
              status="normal"
              trend="stable"
            />
            <VitalCard
              icon={<Activity />}
              title="Blood Pressure"
              value="120/80"
              unit="mmHg"
              status="normal"
              trend="stable"
            />
            <VitalCard
              icon={<Droplet />}
              title="SpO₂"
              value="98"
              unit="%"
              status="normal"
              trend="stable"
            />
            <VitalCard
              icon={<Thermometer />}
              title="Temperature"
              value="36.8"
              unit="°C"
              status="normal"
              trend="stable"
            />
          </div>

          {/* Activity & Sleep Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}>
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>Steps Today</p>
                <Activity className="w-5 h-5" style={{ color: '#0A3D62' }} />
              </div>
              <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '28px' }}>4,300</p>
              <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Goal: 10,000 steps</p>
              <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: '#E8F4F8' }}>
                <div className="h-full rounded-full" style={{ backgroundColor: '#0A3D62', width: '43%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}>
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>Sleep Last Night</p>
                <Moon className="w-5 h-5" style={{ color: '#0A3D62' }} />
              </div>
              <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '28px' }}>7.5 hrs</p>
              <Badge style={{ backgroundColor: '#E8F4F8', color: '#16A34A' }}>Good Quality</Badge>
            </div>
          </div>

          {/* Heart Rate Chart */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}>
            <h4 className="mb-4" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '16px' }}>
              Heart Rate Today
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={vitals.heartRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F4F8" />
                <XAxis dataKey="timestamp" stroke="#1B4F72" style={{ fontSize: '12px' }} />
                <YAxis stroke="#1B4F72" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E8F4F8', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="value" stroke="#0A3D62" strokeWidth={2} dot={{ fill: '#0A3D62' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sync Info */}
          <div className="p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#E8F4F8' }}>
            <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#16A34A' }} />
            <div>
              <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '14px' }}>
                All vitals synced to your medical record
              </p>
              <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>
                Your healthcare provider can now view this data. Last sync: 5 mins ago
              </p>
            </div>
          </div>
        </div>

        {/* Add Device Modal */}
        {showAddDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6 rounded-xl max-w-md w-full mx-4" style={{ backgroundColor: '#FFFFFF' }}>
              <h3 className="mb-4" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>
                Connect Device
              </h3>
              <div className="space-y-3 mb-6">
                <DeviceOption name="Apple Watch" brand="Apple" />
                <DeviceOption name="Fitbit" brand="Fitbit" />
                <DeviceOption name="Samsung Galaxy Watch" brand="Samsung" />
                <DeviceOption name="Google Fit" brand="Google" />
                <DeviceOption name="Other Device" brand="Manual Entry" />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDevice(false)}
                  className="flex-1 rounded-lg border-2"
                  style={{ borderColor: '#E8F4F8', color: '#1B4F72' }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function VitalCard({ icon, title, value, unit, status, trend }: any) {
  const statusColors = {
    normal: '#16A34A',
    warning: '#FFB74D',
    critical: '#FF6F61'
  };

  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
          {icon && <div style={{ color: '#0A3D62' }}>{icon}</div>}
        </div>
        {trend === 'up' && <TrendingUp className="w-4 h-4" style={{ color: statusColors[status] }} />}
        {trend === 'down' && <TrendingDown className="w-4 h-4" style={{ color: statusColors[status] }} />}
      </div>
      <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>{title}</p>
      <div className="flex items-baseline gap-1">
        <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>{value}</p>
        <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>{unit}</p>
      </div>
    </div>
  );
}

function DeviceOption({ name, brand }: { name: string; brand: string }) {
  return (
    <button className="w-full p-4 rounded-lg border-2 hover:border-opacity-80 transition-all text-left" style={{ borderColor: '#E8F4F8' }}>
      <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '14px' }}>{name}</p>
      <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>{brand}</p>
    </button>
  );
}
