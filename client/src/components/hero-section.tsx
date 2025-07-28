import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, CheckCircle, Clock, Truck, Star } from "lucide-react";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [serviceType, setServiceType] = useState("");

  const handleSearch = () => {
    setLocation(`/tailors?location=${encodeURIComponent(searchLocation)}&serviceType=${encodeURIComponent(serviceType)}`);
  };

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-navy leading-tight">
              Professional Tailoring{" "}
              <span className="text-gold">at Your Doorstep</span>
            </h1>
            <p className="text-xl text-warm-gray mt-6 leading-relaxed">
              Connect with verified tailors in your area. From custom stitching to alterations, get perfect fits delivered to your door.
            </p>

            <Card className="mt-8 p-6 bg-gray-50 border-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <Select value={serviceType} onValueChange={setServiceType}>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your area/pincode"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    className="w-full bg-navy text-white hover:bg-blue-700"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Tailors
                  </Button>
                </div>
              </div>
            </Card>

            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center text-warm-gray">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                500+ Verified Tailors
              </div>
              <div className="flex items-center text-warm-gray">
                <Clock className="h-5 w-5 text-gold mr-2" />
                Fast Turnaround
              </div>
              <div className="flex items-center text-warm-gray">
                <Truck className="h-5 w-5 text-blue-500 mr-2" />
                Doorstep Service
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Professional tailor working"
              className="rounded-xl shadow-2xl w-full object-cover h-96"
            />
            <Card className="absolute -bottom-6 -left-6 p-6 shadow-lg bg-white">
              <div className="flex items-center space-x-4">
                <div className="bg-gold text-white w-12 h-12 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-navy">4.9/5</div>
                  <div className="text-sm text-warm-gray">Customer Rating</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
