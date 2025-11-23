import { useState } from 'react';
import { Coffee, AlertTriangle, CheckCircle, Info, Search, X, Apple } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface FoodInteractionCheckerProps {
  medications: string[];
  onClose: () => void;
}

interface FoodItem {
  name: string;
  category: string;
  icon: string;
}

interface InteractionResult {
  food: string;
  status: 'safe' | 'caution' | 'avoid';
  medications: string[];
  message: string;
  recommendation: string;
}

export default function FoodInteractionChecker({ medications, onClose }: FoodInteractionCheckerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [checkResult, setCheckResult] = useState<InteractionResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const commonFoods: FoodItem[] = [
    { name: 'Grapefruit', category: 'Fruit', icon: '🍊' },
    { name: 'Banana', category: 'Fruit', icon: '🍌' },
    { name: 'Coffee', category: 'Beverage', icon: '☕' },
    { name: 'Milk', category: 'Dairy', icon: '🥛' },
    { name: 'Alcohol', category: 'Beverage', icon: '🍷' },
    { name: 'Green Vegetables', category: 'Vegetable', icon: '🥬' },
    { name: 'Spicy Food', category: 'Food', icon: '🌶️' },
    { name: 'Cheese', category: 'Dairy', icon: '🧀' },
    { name: 'Orange Juice', category: 'Beverage', icon: '🍊' },
    { name: 'Chocolate', category: 'Sweet', icon: '🍫' },
    { name: 'Fish', category: 'Protein', icon: '🐟' },
    { name: 'Red Meat', category: 'Protein', icon: '🥩' }
  ];

  const handleAddFood = (foodName: string) => {
    if (!selectedFoods.includes(foodName)) {
      setSelectedFoods([...selectedFoods, foodName]);
    }
  };

  const handleRemoveFood = (foodName: string) => {
    setSelectedFoods(selectedFoods.filter(f => f !== foodName));
  };

  const handleCheckInteractions = () => {
    // Simulate AI checking food interactions with medications
    const results: InteractionResult[] = selectedFoods.map(food => {
      // Mock interaction logic
      if (food === 'Spicy Food' && medications.some(m => m.includes('Omeprazole') || m.includes('ulcer'))) {
        return {
          food,
          status: 'avoid',
          medications: medications.filter(m => m.includes('Omeprazole') || m.includes('ulcer')),
          message: 'Spicy food can worsen stomach ulcers and reduce the effectiveness of ulcer medication.',
          recommendation: 'Avoid spicy foods while on ulcer treatment. Opt for bland, easily digestible meals.'
        };
      } else if (food === 'Grapefruit' && medications.some(m => m.includes('Atorvastatin') || m.includes('statin'))) {
        return {
          food,
          status: 'avoid',
          medications: medications.filter(m => m.includes('statin')),
          message: 'Grapefruit can increase statin levels in your blood, raising the risk of side effects.',
          recommendation: 'Avoid grapefruit and grapefruit juice. Try oranges or other citrus fruits instead.'
        };
      } else if (food === 'Alcohol' && medications.some(m => m.includes('Metformin') || m.includes('Lisinopril'))) {
        return {
          food,
          status: 'caution',
          medications: medications.filter(m => m.includes('Metformin') || m.includes('Lisinopril')),
          message: 'Alcohol may affect blood sugar control and blood pressure.',
          recommendation: 'Limit alcohol consumption. If you drink, do so in moderation and monitor your symptoms.'
        };
      } else if (food === 'Banana' && medications.some(m => m.includes('Lisinopril'))) {
        return {
          food,
          status: 'caution',
          medications: medications.filter(m => m.includes('Lisinopril')),
          message: 'Bananas are high in potassium. Lisinopril can increase potassium levels.',
          recommendation: 'Moderate your banana intake. Consider getting a potassium level check from your doctor.'
        };
      } else if (food === 'Green Vegetables' && medications.some(m => m.includes('Warfarin'))) {
        return {
          food,
          status: 'caution',
          medications: medications.filter(m => m.includes('Warfarin')),
          message: 'Green leafy vegetables contain vitamin K, which can reduce Warfarin effectiveness.',
          recommendation: 'Keep your intake consistent rather than avoiding completely. Discuss with your doctor.'
        };
      } else {
        return {
          food,
          status: 'safe',
          medications: [],
          message: `No known interactions between ${food} and your current medications.`,
          recommendation: 'Safe to consume as part of a balanced diet.'
        };
      }
    });

    setCheckResult(results);
    setShowResults(true);
  };

  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avoidCount = checkResult.filter(r => r.status === 'avoid').length;
  const cautionCount = checkResult.filter(r => r.status === 'caution').length;
  const safeCount = checkResult.filter(r => r.status === 'safe').length;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#F2F6FA' }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '24px' }}>
            🍎 Food Interaction Checker
          </DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <>
            {/* Current Medications */}
            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
              <p className="mb-2" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                Checking interactions with your current medications:
              </p>
              <div className="flex flex-wrap gap-2">
                {medications.length > 0 ? (
                  medications.map((med, idx) => (
                    <Badge key={idx} style={{ backgroundColor: '#FFFFFF', color: '#0A3D62' }}>
                      {med}
                    </Badge>
                  ))
                ) : (
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }}>
                    No active medications found
                  </p>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#1B4F72' }} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search foods..."
                className="pl-10 rounded-lg"
                style={{ fontFamily: 'Roboto' }}
              />
            </div>

            {/* Selected Foods */}
            {selectedFoods.length > 0 && (
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                <p className="mb-2" style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '14px' }}>
                  Selected Foods ({selectedFoods.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedFoods.map(food => (
                    <Badge
                      key={food}
                      className="cursor-pointer"
                      style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
                      onClick={() => handleRemoveFood(food)}
                    >
                      {food} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Food Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {filteredFoods.map(food => (
                <button
                  key={food.name}
                  onClick={() => handleAddFood(food.name)}
                  disabled={selectedFoods.includes(food.name)}
                  className="p-4 rounded-lg border-2 hover:border-opacity-80 transition-all text-center"
                  style={{
                    borderColor: selectedFoods.includes(food.name) ? '#0A3D62' : '#E8F4F8',
                    backgroundColor: selectedFoods.includes(food.name) ? '#E8F4F8' : '#FFFFFF',
                    opacity: selectedFoods.includes(food.name) ? 0.7 : 1
                  }}
                >
                  <div className="text-3xl mb-2">{food.icon}</div>
                  <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '13px' }}>
                    {food.name}
                  </p>
                  <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '11px' }}>
                    {food.category}
                  </p>
                </button>
              ))}
            </div>

            <Button
              onClick={handleCheckInteractions}
              disabled={selectedFoods.length === 0}
              className="w-full rounded-lg"
              style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
            >
              Check Interactions
            </Button>
          </>
        ) : (
          <>
            {/* Results Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#FFF5F5' }}>
                <p style={{ fontFamily: 'Nunito Sans', color: '#FF6F61', fontSize: '28px' }}>
                  {avoidCount}
                </p>
                <p style={{ fontFamily: 'Roboto', color: '#FF6F61', fontSize: '13px' }}>
                  Avoid
                </p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#FFF9F0' }}>
                <p style={{ fontFamily: 'Nunito Sans', color: '#FFB74D', fontSize: '28px' }}>
                  {cautionCount}
                </p>
                <p style={{ fontFamily: 'Roboto', color: '#FFB74D', fontSize: '13px' }}>
                  Caution
                </p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#F0FDF4' }}>
                <p style={{ fontFamily: 'Nunito Sans', color: '#16A34A', fontSize: '28px' }}>
                  {safeCount}
                </p>
                <p style={{ fontFamily: 'Roboto', color: '#16A34A', fontSize: '13px' }}>
                  Safe
                </p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4 mb-6">
              {checkResult.map((result, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    backgroundColor: result.status === 'avoid' ? '#FFF5F5' : result.status === 'caution' ? '#FFF9F0' : '#F0FDF4',
                    borderColor: result.status === 'avoid' ? '#FF6F61' : result.status === 'caution' ? '#FFB74D' : '#16A34A'
                  }}
                >
                  <div className="flex items-start gap-3">
                    {result.status === 'avoid' && <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: '#FF6F61' }} />}
                    {result.status === 'caution' && <Info className="w-5 h-5 mt-0.5" style={{ color: '#FFB74D' }} />}
                    {result.status === 'safe' && <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#16A34A' }} />}
                    
                    <div className="flex-1">
                      <p style={{ fontFamily: 'Nunito Sans', color: '#0A3D62', fontSize: '16px' }} className="mb-1">
                        {result.food}
                      </p>
                      
                      {result.medications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {result.medications.map((med, i) => (
                            <Badge key={i} style={{ backgroundColor: '#FFFFFF', color: '#1B4F72', fontSize: '10px' }}>
                              {med}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p style={{ fontFamily: 'Roboto', color: '#1B4F72', fontSize: '13px' }} className="mb-2">
                        {result.message}
                      </p>

                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                        <p style={{ fontFamily: 'Roboto', color: '#0A3D62', fontSize: '12px' }}>
                          💡 <strong>Recommendation:</strong> {result.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setSelectedFoods([]);
                  setCheckResult([]);
                }}
                className="flex-1 rounded-lg border-2"
                style={{ borderColor: '#E8F4F8', color: '#1B4F72' }}
              >
                Check More Foods
              </Button>
              <Button
                onClick={() => {
                  // Share with doctor
                  alert('Results will be shared with your healthcare provider');
                }}
                className="flex-1 rounded-lg"
                style={{ backgroundColor: '#0A3D62', color: '#FFFFFF' }}
              >
                Share with Doctor
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
