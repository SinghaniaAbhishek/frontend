import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';

interface OnboardingPopupProps {
  isOpen: boolean;
  onComplete: () => void;
}

const OnboardingPopup = ({ isOpen, onComplete }: OnboardingPopupProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    income: '',
    incomeSource: '',
    monthlyBudget: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (formData.income && formData.incomeSource) {
        setStep(2);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.income || !formData.incomeSource || !formData.monthlyBudget) {
      return;
    }

    setIsLoading(true);
    try {
      await api.updateProfile({
        income: parseFloat(formData.income),
        incomeSource: formData.incomeSource,
        monthlyBudget: parseFloat(formData.monthlyBudget)
      });
      onComplete();
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incomeSources = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Rental Income',
    'Other'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Welcome to Kuber! 🎉
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Progress indicator */}
              <div className="flex justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              </div>

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Let's start with your income</h3>
                    <p className="text-sm text-muted-foreground">
                      This helps us provide better insights and recommendations
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="income">Monthly Income (₹)</Label>
                      <Input
                        id="income"
                        type="number"
                        placeholder="e.g., 50000"
                        value={formData.income}
                        onChange={(e) => handleInputChange('income', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="incomeSource">Income Source</Label>
                      <Select value={formData.incomeSource} onValueChange={(value) => handleInputChange('incomeSource', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your income source" />
                        </SelectTrigger>
                        <SelectContent>
                          {incomeSources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleNext}
                    disabled={!formData.income || !formData.incomeSource}
                    className="w-full"
                  >
                    Next Step
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Set your monthly budget</h3>
                    <p className="text-sm text-muted-foreground">
                      This helps us track your spending and provide alerts
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="monthlyBudget">Monthly Budget (₹)</Label>
                    <Input
                      id="monthlyBudget"
                      type="number"
                      placeholder="e.g., 40000"
                      value={formData.monthlyBudget}
                      onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!formData.monthlyBudget || isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Saving...' : 'Complete Setup'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default OnboardingPopup;