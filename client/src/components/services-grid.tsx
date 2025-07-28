import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Shirt, User, Scissors, GraduationCap, Clock } from "lucide-react";

const services = [
  {
    id: "mens_wear",
    title: "Men's Wear",
    description: "Shirts, pants, suits, sherwanis and traditional wear",
    price: "Starting from ₹299",
    deliveryTime: "3-5 days delivery",
    icon: Shirt,
  },
  {
    id: "womens_wear",
    title: "Women's Wear",
    description: "Blouses, suits, lehengas, sarees and ethnic wear",
    price: "Starting from ₹399",
    deliveryTime: "4-6 days delivery",
    icon: User,
  },
  {
    id: "alterations",
    title: "Alterations",
    description: "Hemming, resizing, repairs and adjustments",
    price: "Starting from ₹99",
    deliveryTime: "1-2 days delivery",
    icon: Scissors,
  },
  {
    id: "uniforms",
    title: "Uniforms",
    description: "School uniforms, corporate wear and workwear",
    price: "Starting from ₹199",
    deliveryTime: "2-4 days delivery",
    icon: GraduationCap,
  },
];

export default function ServicesGrid() {
  const [, setLocation] = useLocation();

  const handleServiceClick = (serviceId: string) => {
    setLocation(`/tailors?serviceType=${serviceId}`);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-navy mb-4">Our Services</h2>
          <p className="text-xl text-warm-gray max-w-2xl mx-auto">
            From custom tailoring to quick alterations, we've got all your clothing needs covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={service.id}
                className="bg-white shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleServiceClick(service.id)}
              >
                <CardContent className="p-6">
                  <div className="bg-navy text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold transition-colors">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-2">{service.title}</h3>
                  <p className="text-warm-gray mb-4">{service.description}</p>
                  <div className="text-sm text-gray-500 mb-4">{service.price}</div>
                  <div className="text-sm text-green-600 font-medium">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {service.deliveryTime}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
