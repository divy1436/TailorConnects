import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import TailorCard from "@/components/tailor-card";
import BookingModal from "@/components/booking-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { Search, Filter } from "lucide-react";
import type { TailorWithUser } from "@shared/schema";

export default function Tailors() {
  const [location, setLocation] = useLocation();
  const [filters, setFilters] = useState({
    location: "",
    serviceType: "",
    rating: "",
  });
  const [selectedTailor, setSelectedTailor] = useState<TailorWithUser | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1]);
    setFilters({
      location: urlParams.get('location') || "",
      serviceType: urlParams.get('serviceType') || "",
      rating: urlParams.get('rating') || "",
    });
  }, [location]);

  const { data: tailors, isLoading, error } = useQuery({
    queryKey: ["/api/tailors", filters.location, filters.serviceType, filters.rating],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.serviceType) params.append('serviceType', filters.serviceType);
      if (filters.rating) params.append('rating', filters.rating);
      
      const response = await fetch(`/api/tailors?${params}`);
      if (!response.ok) throw new Error('Failed to fetch tailors');
      return response.json() as Promise<TailorWithUser[]>;
    },
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.serviceType) params.append('serviceType', filters.serviceType);
    if (filters.rating) params.append('rating', filters.rating);
    
    setLocation(`/tailors?${params.toString()}`);
  };

  const handleBookTailor = (tailor: TailorWithUser) => {
    setSelectedTailor(tailor);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Section */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Tailors</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with experienced, verified tailors in your area
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="serviceType">Specialization</Label>
                <Select value={filters.serviceType} onValueChange={(value) => handleFilterChange("serviceType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Services</SelectItem>
                    <SelectItem value="custom_stitching">Custom Stitching</SelectItem>
                    <SelectItem value="alterations">Alterations</SelectItem>
                    <SelectItem value="repairs">Repairs</SelectItem>
                    <SelectItem value="uniforms">Uniforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter area or pincode"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Ratings</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={applyFilters} className="w-full bg-navy text-white hover:bg-blue-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Tailors Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">Failed to load tailors</div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : !tailors || tailors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-navy mb-2">No tailors found</h3>
              <p className="text-warm-gray mb-6">
                Try adjusting your filters or search in a different area
              </p>
              <Button onClick={() => setFilters({ location: "", serviceType: "", rating: "" })} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-warm-gray">
                  Found {tailors.length} tailor{tailors.length !== 1 ? 's' : ''} 
                  {filters.location && ` in ${filters.location}`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tailors.map((tailor) => (
                  <div key={tailor.id} onClick={() => handleBookTailor(tailor)}>
                    <TailorCard tailor={tailor} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tailor={selectedTailor}
      />
    </div>
  );
}
