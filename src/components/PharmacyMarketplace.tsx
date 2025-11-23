import { useState } from 'react';
import { Search, ShoppingCart, AlertTriangle, CheckCircle, Info, Plus, Minus, X, Filter, Heart, Star, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface PharmacyMarketplaceProps {
  patientHistory: any;
  onClose: () => void;
}

interface Medication {
  id: string;
  name: string;
  genericName: string;
  price: number;
  pharmacy: string;
  inStock: boolean;
  requiresPrescription: boolean;
  dosageForm: string;
  strength: string;
  purpose: string;
  sideEffects: string[];
  ingredients: string[];
  rating: number;
  reviews: number;
}

interface CartItem extends Medication {
  quantity: number;
  riskLevel?: 'safe' | 'moderate' | 'high';
  riskReason?: string;
}

export default function PharmacyMarketplace({ patientHistory, onClose }: PharmacyMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [safetyCheck, setSafetyCheck] = useState<any>(null);

  // Mock medications with personalized suggestions
  const medications: Medication[] = [
    {
      id: '1',
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      price: 850,
      pharmacy: 'HealthPlus Pharmacy',
      inStock: true,
      requiresPrescription: false,
      dosageForm: 'Capsule',
      strength: '20mg',
      purpose: 'Treats stomach ulcers, acid reflux, and GERD',
      sideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Abdominal pain'],
      ingredients: ['Omeprazole', 'Lactose', 'Magnesium stearate'],
      rating: 4.5,
      reviews: 234
    },
    {
      id: '2',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      price: 250,
      pharmacy: 'MediCare Pharmacy',
      inStock: true,
      requiresPrescription: false,
      dosageForm: 'Tablet',
      strength: '500mg',
      purpose: 'Pain relief and fever reduction',
      sideEffects: ['Nausea', 'Allergic reactions (rare)'],
      ingredients: ['Paracetamol', 'Starch', 'Povidone'],
      rating: 4.8,
      reviews: 512
    },
    {
      id: '3',
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      price: 420,
      pharmacy: 'HealthPlus Pharmacy',
      inStock: true,
      requiresPrescription: false,
      dosageForm: 'Tablet',
      strength: '400mg',
      purpose: 'Anti-inflammatory pain reliever',
      sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness'],
      ingredients: ['Ibuprofen', 'Microcrystalline cellulose'],
      rating: 4.3,
      reviews: 189
    },
    {
      id: '4',
      name: 'Lisinopril 10mg',
      genericName: 'Lisinopril',
      price: 1250,
      pharmacy: 'MediCare Pharmacy',
      inStock: true,
      requiresPrescription: true,
      dosageForm: 'Tablet',
      strength: '10mg',
      purpose: 'Blood pressure control',
      sideEffects: ['Dizziness', 'Dry cough', 'Headache'],
      ingredients: ['Lisinopril', 'Mannitol', 'Calcium phosphate'],
      rating: 4.6,
      reviews: 342
    }
  ];

  const handleAddToCart = (med: Medication) => {
    const existingItem = cart.find(item => item.id === med.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...med, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = () => {
    // Run AI safety screening
    const screenedCart = cart.map(item => {
      // Check against patient history for risks
      let riskLevel: 'safe' | 'moderate' | 'high' = 'safe';
      let riskReason = '';

      // Example risk checks
      if (item.name.includes('Ibuprofen') && patientHistory?.conditions?.includes('peptic ulcer')) {
        riskLevel = 'high';
        riskReason = 'NSAIDs like Ibuprofen can worsen peptic ulcers. This purchase is blocked for your safety.';
      } else if (item.name.includes('Omeprazole') && patientHistory?.medications?.includes('Lisinopril')) {
        riskLevel = 'moderate';
        riskReason = 'May reduce effectiveness of Lisinopril. Consider consulting your doctor.';
      }

      return { ...item, riskLevel, riskReason };
    });

    const hasHighRisk = screenedCart.some(item => item.riskLevel === 'high');
    const hasModerateRisk = screenedCart.some(item => item.riskLevel === 'moderate');

    setSafetyCheck({
      items: screenedCart,
      hasHighRisk,
      hasModerateRisk,
      canProceed: !hasHighRisk
    });

    setCart(screenedCart);
    setShowCheckout(true);
  };

  const filteredMeds = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#F2F6FA' }}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
              Pharmacy Marketplace
            </DialogTitle>
            <Button
              variant="ghost"
              onClick={() => setShowCart(true)}
              className="relative"
              style={{ color: '#1B4F72' }}
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FF6F61', color: '#FFFFFF', fontSize: '12px' }}
                >
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#1B4F72' }} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medications, symptoms, or conditions..."
            className="pl-10 rounded-lg"
            style={{ fontFamily: 'Roboto' }}
          />
        </div>

        {/* Personalized Suggestions */}
        <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
          <div className="flex items-start gap-2 mb-2">
            <Heart className="w-5 h-5 mt-0.5" style={{ color: '#0A3D62' }} />
            <div>
              <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '16px' }}>
                Personalized for You
              </p>
              <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }}>
                Based on your medical history and recent symptoms
              </p>
            </div>
          </div>
        </div>

        {/* Medication Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredMeds.map(med => (
            <div
              key={med.id}
              className="p-4 rounded-xl cursor-pointer hover:shadow-lg transition-all"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(10, 61, 98, 0.08)' }}
              onClick={() => setSelectedMed(med)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '16px' }}>
                    {med.name}
                  </h4>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>
                    {med.genericName} • {med.dosageForm}
                  </p>
                </div>
                {med.requiresPrescription && (
                  <Badge style={{ backgroundColor: '#FFB74D', color: '#FFFFFF', fontSize: '10px' }}>
                    Rx Required
                  </Badge>
                )}
              </div>

              <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }} className="mb-3 line-clamp-2">
                {med.purpose}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>
                    ₦{med.price.toLocaleString()}
                  </p>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '11px' }}>
                    {med.pharmacy}
                  </p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(med);
                  }}
                  className="rounded-lg"
                  style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 fill-current" style={{ color: '#FFB74D' }} />
                <span style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>
                  {med.rating} ({med.reviews} reviews)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Medication Details Modal */}
        {selectedMed && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                    {selectedMed.name}
                  </h3>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                    Generic: {selectedMed.genericName}
                  </p>
                </div>
                <button onClick={() => setSelectedMed(null)}>
                  <X className="w-6 h-6" style={{ color: '#1B4F72' }} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Purpose</p>
                  <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '14px' }}>{selectedMed.purpose}</p>
                </div>

                <div>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Dosage Form & Strength</p>
                  <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '14px' }}>
                    {selectedMed.dosageForm} - {selectedMed.strength}
                  </p>
                </div>

                <div>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Ingredients</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedMed.ingredients.map((ing, idx) => (
                      <Badge key={idx} style={{ backgroundColor: '#E8F4F8', color: '#1B4F72' }}>
                        {ing}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>Possible Side Effects</p>
                  <ul className="mt-1 space-y-1">
                    {selectedMed.sideEffects.map((effect, idx) => (
                      <li key={idx} style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '13px' }}>
                        • {effect}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: '#E8F4F8' }}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '28px' }}>
                        ₦{selectedMed.price.toLocaleString()}
                      </p>
                      <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }}>
                        Available at {selectedMed.pharmacy}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      handleAddToCart(selectedMed);
                      setSelectedMed(null);
                    }}
                    className="w-full rounded-lg"
                    style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                  Your Cart ({cart.length})
                </h3>
                <button onClick={() => setShowCart(false)}>
                  <X className="w-6 h-6" style={{ color: '#1B4F72' }} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4" style={{ color: '#E8F4F8' }} />
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map(item => (
                      <div
                        key={item.id}
                        className="p-4 rounded-lg flex items-center justify-between"
                        style={{ backgroundColor: '#F2F6FA' }}
                      >
                        <div className="flex-1">
                          <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '14px' }}>
                            {item.name}
                          </p>
                          <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '12px' }}>
                            ₦{item.price.toLocaleString()} each
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ backgroundColor: '#E8F4F8' }}
                            >
                              <Minus className="w-3 h-3" style={{ color: '#0A3D62' }} />
                            </button>
                            <span style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '14px' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ backgroundColor: '#E8F4F8' }}
                            >
                              <Plus className="w-3 h-3" style={{ color: '#0A3D62' }} />
                            </button>
                          </div>
                          <button onClick={() => handleRemoveFromCart(item.id)}>
                            <X className="w-5 h-5" style={{ color: '#FF6F61' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: '#E8F4F8' }}>
                    <div className="flex justify-between items-center mb-4">
                      <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '20px' }}>Total</p>
                      <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                        ₦{totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full rounded-lg"
                      style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Checkout with Safety Screening */}
        {showCheckout && safetyCheck && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
              <h3 className="mb-6" style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
                Safety Check Complete
              </h3>

              <div className="space-y-4 mb-6">
                {safetyCheck.items.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      backgroundColor: item.riskLevel === 'high' ? '#FFF5F5' : item.riskLevel === 'moderate' ? '#FFF9F0' : '#F0FDF4',
                      borderColor: item.riskLevel === 'high' ? '#FF6F61' : item.riskLevel === 'moderate' ? '#FFB74D' : '#16A34A'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {item.riskLevel === 'high' && <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: '#FF6F61' }} />}
                      {item.riskLevel === 'moderate' && <Info className="w-5 h-5 mt-0.5" style={{ color: '#FFB74D' }} />}
                      {item.riskLevel === 'safe' && <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#16A34A' }} />}
                      <div className="flex-1">
                        <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '16px' }}>
                          {item.name}
                        </p>
                        {item.riskReason && (
                          <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }} className="mt-1">
                            {item.riskReason}
                          </p>
                        )}
                        {!item.riskReason && (
                          <p style={{ fontFamily: 'Roboto', color: '#16A34A', fontSize: '13px' }} className="mt-1">
                            Safe to purchase based on your medical history
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {safetyCheck.hasHighRisk && (
                <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#FFF5F5', borderLeft: '4px solid #FF6F61' }}>
                  <p style={{ fontFamily: 'Nunito Sans', color: '#FF6F61', fontSize: '16px' }} className="mb-2">
                    Purchase Blocked
                  </p>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }}>
                    For your safety, we cannot process this order. Please consult with your healthcare provider for safer alternatives.
                  </p>
                </div>
              )}

              {safetyCheck.hasModerateRisk && !safetyCheck.hasHighRisk && (
                <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#FFF9F0', borderLeft: '4px solid #FFB74D' }}>
                  <p style={{ fontFamily: 'Nunito Sans', color: '#FFB74D', fontSize: '16px' }} className="mb-2">
                    Caution Advised
                  </p>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }}>
                    This medication may interact with your current treatment. We recommend consulting your doctor before purchase.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCheckout(false);
                    setSafetyCheck(null);
                  }}
                  className="flex-1 rounded-lg border-2"
                  style={{ borderColor: '#E8F4F8', color: '#1B4F72' }}
                >
                  Back to Cart
                </Button>
                {safetyCheck.canProceed && (
                  <Button
                    onClick={() => {
                      // Process order
                      setShowCheckout(false);
                      setShowCart(false);
                      setCart([]);
                      alert('Order placed successfully!');
                      onClose();
                    }}
                    className="flex-1 rounded-lg"
                    style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                  >
                    Complete Purchase
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
