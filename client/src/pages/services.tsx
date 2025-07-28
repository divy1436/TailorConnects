import Navigation from "@/components/navigation";
import ServicesGrid from "@/components/services-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Shirt, 
  User, 
  Scissors, 
  GraduationCap, 
  Clock, 
  Star, 
  CheckCircle,
  Ruler,
  Upload,
  Truck
} from "lucide-react";

const serviceDetails = [
  {
    id: "mens_wear",
    title: "Men's Wear",
    description: "Professional tailoring for all types of men's clothing",
    icon: Shirt,
    items: [
      { name: "Formal Shirts", price: "₹299 - ₹599", time: "3-4 days" },
      { name: "Casual Shirts", price: "₹249 - ₹499", time: "2-3 days" },
      { name: "Formal Pants", price: "₹399 - ₹799", time: "4-5 days" },
      { name: "Suits", price: "₹1,999 - ₹4,999", time: "7-10 days" },
      { name: "Sherwanis", price: "₹2,499 - ₹5,999", time: "8-12 days" },
      { name: "Kurtas", price: "₹349 - ₹699", time: "3-4 days" },
    ],
  },
  {
    id: "womens_wear",
    title: "Women's Wear",
    description: "Expert stitching for women's ethnic and western wear",
    icon: User,
    items: [
      { name: "Blouses", price: "₹399 - ₹899", time: "4-5 days" },
      { name: "Salwar Suits", price: "₹699 - ₹1,499", time: "5-7 days" },
      { name: "Lehengas", price: "₹2,999 - ₹7,999", time: "10-15 days" },
      { name: "Saree Blouses", price: "₹499 - ₹999", time: "4-6 days" },
      { name: "Western Dresses", price: "₹899 - ₹1,999", time: "5-7 days" },
      { name: "Kurtis", price: "₹349 - ₹699", time: "3-4 days" },
    ],
  },
  {
    id: "alterations",
    title: "Alterations & Repairs",
    description: "Quick fixes and adjustments for perfect fits",
    icon: Scissors,
    items: [
      { name: "Hemming", price: "₹99 - ₹249", time: "1-2 days" },
      { name: "Taking In/Out", price: "₹149 - ₹349", time: "1-2 days" },
      { name: "Sleeve Adjustments", price: "₹129 - ₹299", time: "1-2 days" },
      { name: "Zipper Replacement", price: "₹199 - ₹399", time: "1-2 days" },
      { name: "Button Repairs", price: "₹49 - ₹149", time: "1 day" },
      { name: "Tear Repairs", price: "₹149 - ₹499", time: "2-3 days" },
    ],
  },
  {
    id: "uniforms",
    title: "Uniforms",
    description: "Professional uniforms for schools and corporates",
    icon: GraduationCap,
    items: [
      { name: "School Uniforms", price: "₹199 - ₹499", time: "2-3 days" },
      { name: "Corporate Shirts", price: "₹299 - ₹599", time: "3-4 days" },
      { name: "Security Uniforms", price: "₹399 - ₹799", time: "3-5 days" },
      { name: "Hospital Scrubs", price: "₹349 - ₹699", time: "2-4 days" },
      { name: "Chef Coats", price: "₹499 - ₹999", time: "3-5 days" },
      { name: "Sports Uniforms", price: "₹299 - ₹699", time: "4-6 days" },
    ],
  },
];

const features = [
  { icon: Ruler, title: "Measurement Guide", description: "Visual guides and video tutorials for accurate measurements" },
  { icon: Upload, title: "Reference Images", description: "Upload design references for custom tailoring" },
  { icon: Truck, title: "Doorstep Service", description: "Free pickup and delivery within city limits" },
  { icon: Star, title: "Quality Assured", description: "100% satisfaction guarantee on all services" },
];

export default function Services() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Section */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional tailoring services with doorstep convenience. From custom stitching to quick alterations.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gold text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">{feature.title}</h3>
                  <p className="text-warm-gray text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {serviceDetails.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="bg-white shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="bg-navy text-white w-16 h-16 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-navy">{service.title}</CardTitle>
                        <p className="text-warm-gray">{service.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {service.items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-navy mb-2">{item.name}</h4>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-warm-gray">Price:</span>
                            <span className="font-medium text-navy">{item.price}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-warm-gray">Time:</span>
                            <span className="flex items-center text-green-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {item.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => setLocation(`/tailors?serviceType=${service.id}`)}
                        className="bg-navy text-white hover:bg-blue-700 px-8 py-2"
                      >
                        Find Tailors for {service.title}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Measurement Guide Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">Measurement Guide</h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Get the perfect fit with our detailed measurement guides
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-navy mb-4">How to Measure</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Use a measuring tape</h4>
                      <p className="text-sm text-warm-gray">Soft measuring tape works best for accurate measurements</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Wear fitted clothes</h4>
                      <p className="text-sm text-warm-gray">Take measurements over fitted undergarments</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Stand naturally</h4>
                      <p className="text-sm text-warm-gray">Maintain a relaxed, natural posture</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Get help if needed</h4>
                      <p className="text-sm text-warm-gray">Ask someone to help for better accuracy</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-gray-100 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">📏</div>
              <h3 className="text-xl font-semibold text-navy mb-4">Need Help with Measurements?</h3>
              <p className="text-warm-gray mb-6">
                Our tailors can visit your location for accurate measurements at a small additional cost
              </p>
              <Button className="bg-gold text-navy hover:bg-yellow-400 font-semibold">
                Book Measurement Visit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Find the perfect tailor for your needs and book your service today
          </p>
          <Button
            onClick={() => setLocation("/tailors")}
            className="bg-gold text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400"
          >
            Find Tailors Near You
          </Button>
        </div>
      </section>
    </div>
  );
}
