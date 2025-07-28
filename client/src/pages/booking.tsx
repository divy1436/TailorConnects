import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Star, MapPin, Clock, IndianRupee, Phone, Mail, Calendar, Upload } from "lucide-react";
import type { TailorWithUser, Service } from "@shared/schema";

export default function Booking() {
  const { tailorId } = useParams();
  const [, setLocation] = useLocation();
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

  // Fetch tailor details
  const { data: tailor, isLoading: tailorLoading } = useQuery({
    queryKey: ["/api/tailors", tailorId],
    queryFn: async () => {
      const response = await fetch(`/api/tailors/${tailorId}`);
      if (!response.ok) throw new Error("Failed to fetch tailor details");
      return response.json() as Promise<TailorWithUser>;
    },
    enabled: !!tailorId,
  });

  // Fetch tailor services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/tailors", tailorId, "services"],
    queryFn: async () => {
      const response = await fetch(`/api/tailors/${tailorId}/services`);
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json() as Promise<Service[]>;
    },
    enabled: !!tailorId,
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
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create booking");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been confirmed. You will receive a confirmation SMS shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/customer"] });
      setLocation("/customer-dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !tailor) {
      toast({
        title: "Authentication Required",
        description: "Please login to book a service",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }

    if (!formData.serviceType || !formData.garmentType || !formData.pickupDate || !formData.pickupAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedService = services?.find(s => s.serviceType === formData.serviceType);
    if (!selectedService) {
      toast({
        title: "Invalid Service",
        description: "Please select a valid service",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      tailorId: tailor.id,
      serviceId: selectedService.id,
      serviceType: formData.serviceType,
      garmentType: formData.garmentType,
      pickupAddress: formData.pickupAddress,
      pickupDate: new Date(`${formData.pickupDate}T${formData.pickupTime || "10:00"}`),
      specialInstructions: formData.specialInstructions,
      measurements: JSON.stringify({ type: formData.measurements }),
      paymentMethod: formData.paymentMethod,
      totalAmount: selectedService.price,
    };

    bookingMutation.mutate(bookingData);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-gold fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (tailorLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-1/2 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!tailor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-navy mb-2">Tailor Not Found</h2>
          <p className="text-warm-gray mb-6">The tailor you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation("/tailors")} className="bg-navy text-white hover:bg-blue-700">
            Browse All Tailors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tailor Profile */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-navy">Tailor Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={tailor.user.name} />
                    <AvatarFallback className="text-xl">
                      {tailor.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-navy">{tailor.user.name}</h3>
                      <Badge variant={tailor.isVerified ? "default" : "secondary"} className="bg-green-100 text-green-800">
                        {tailor.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">{renderStars(parseFloat(tailor.rating || "0"))}</div>
                      <span className="text-sm text-warm-gray">
                        {tailor.rating} ({tailor.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-warm-gray text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {tailor.location}
                    </div>
                  </div>
                </div>

                {tailor.description && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-navy mb-2">About</h4>
                    <p className="text-warm-gray text-sm">{tailor.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{tailor.avgDeliveryDays} days avg delivery</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <IndianRupee className="h-4 w-4 mr-2 text-green-500" />
                    <span>From ₹{tailor.startingPrice}</span>
                  </div>
                </div>

                {tailor.specializations && tailor.specializations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-navy mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {tailor.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-navy">Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-16 w-full" />
                    ))}
                  </div>
                ) : services && services.length > 0 ? (
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-navy capitalize">
                              {service.serviceType.replace('_', ' ')}
                            </h5>
                            {service.description && (
                              <p className="text-sm text-warm-gray mt-1">{service.description}</p>
                            )}
                            <div className="flex items-center mt-2 text-xs text-warm-gray">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.deliveryDays} days
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-navy">₹{service.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-warm-gray">No services available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-navy">Book Service</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Details */}
                <div>
                  <h3 className="text-lg font-semibold text-navy mb-4">Service Details</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services?.map((service) => (
                            <SelectItem key={service.id} value={service.serviceType}>
                              {service.serviceType.replace('_', ' ')} - ₹{service.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="garmentType">Garment Type *</Label>
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
                          <SelectItem value="lehenga">Lehenga</SelectItem>
                          <SelectItem value="saree">Saree</SelectItem>
                          <SelectItem value="kurta">Kurta</SelectItem>
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
                      <Label htmlFor="pickupDate">Pickup Date *</Label>
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
                    <Label htmlFor="pickupAddress">Pickup Address *</Label>
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

                {/* File Upload */}
                <div>
                  <Label>Reference Images (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-navy transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Drop images here or click to upload</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

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
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setLocation("/tailors")}
                  >
                    Back to Tailors
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
