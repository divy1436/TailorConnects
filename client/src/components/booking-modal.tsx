import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import type { TailorWithUser } from "@shared/schema";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tailor: TailorWithUser | null;
}

export default function BookingModal({ isOpen, onClose, tailor }: BookingModalProps) {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    serviceType: "",
    garmentType: "",
    pickupDate: "",
    pickupTime: "",
    pickupAddress: "",
    specialInstructions: "",
    measurements: "existing",
    paymentMethod: "online",
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      if (!token) throw new Error("Please login to book a service");
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) throw new Error("Failed to create booking");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been confirmed. You will receive a confirmation SMS shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/customer"] });
      onClose();
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      serviceType: "",
      garmentType: "",
      pickupDate: "",
      pickupTime: "",
      pickupAddress: "",
      specialInstructions: "",
      measurements: "existing",
      paymentMethod: "online",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !tailor) {
      toast({
        title: "Authentication Required",
        description: "Please login to book a service",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      tailorId: tailor.id,
      serviceId: tailor.id, // This should be actual service ID from tailor's services
      serviceType: formData.serviceType,
      garmentType: formData.garmentType,
      pickupAddress: formData.pickupAddress,
      pickupDate: new Date(`${formData.pickupDate}T${formData.pickupTime || "10:00"}`),
      specialInstructions: formData.specialInstructions,
      measurements: JSON.stringify({ type: formData.measurements }),
      paymentMethod: formData.paymentMethod,
      totalAmount: "399", // This should be calculated based on service
    };

    bookingMutation.mutate(bookingData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!tailor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-navy">Book Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Details */}
          <div>
            <h3 className="text-lg font-semibold text-navy mb-4">Service Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom_stitching">Custom Stitching</SelectItem>
                    <SelectItem value="alterations">Alterations</SelectItem>
                    <SelectItem value="repairs">Repairs</SelectItem>
                    <SelectItem value="uniforms">Uniforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="garmentType">Garment Type</Label>
                <Select value={formData.garmentType} onValueChange={(value) => handleInputChange("garmentType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select garment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirt">Shirt</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="suit">Suit</SelectItem>
                    <SelectItem value="dress">Dress</SelectItem>
                    <SelectItem value="blouse">Blouse</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pickup Details */}
          <div>
            <h3 className="text-lg font-semibold text-navy mb-4">Pickup & Delivery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupDate">Pickup Date</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="pickupTime">Pickup Time</Label>
                <Select value={formData.pickupTime} onValueChange={(value) => handleInputChange("pickupTime", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="12:00">12:00 PM - 3:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM - 6:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM - 9:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Textarea
                id="pickupAddress"
                placeholder="Enter your complete address..."
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Measurements */}
          <div>
            <h3 className="text-lg font-semibold text-navy mb-4">Measurements</h3>
            <RadioGroup
              value={formData.measurements}
              onValueChange={(value) => handleInputChange("measurements", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing">Use saved measurements</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">Enter new measurements</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home-visit" id="home-visit" />
                <Label htmlFor="home-visit">Request measurement visit (+₹50)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Special Instructions */}
          <div>
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              placeholder="Any specific requirements or notes for the tailor..."
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
              rows={3}
            />
          </div>

          {/* Price Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-navy mb-3">Price Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>₹399</span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup & Delivery</span>
                  <span>₹50</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>First Order Discount</span>
                  <span>-₹100</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹349</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <div>
            <h4 className="font-semibold text-navy mb-3">Payment Method</h4>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => handleInputChange("paymentMethod", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="flex items-center space-x-3 flex-1">
                  <span>Pay Online (Get 5% extra discount)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex items-center space-x-3 flex-1">
                  <span>Cash on Delivery</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-navy text-white hover:bg-blue-700"
              disabled={bookingMutation.isPending}
            >
              {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
