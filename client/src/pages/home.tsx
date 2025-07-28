import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicesGrid from "@/components/services-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Star, Facebook, Twitter, Instagram, Linkedin, Smartphone, Download } from "lucide-react";

const testimonials = [
  {
    name: "Priya Patel",
    location: "Mumbai",
    content: "Excellent service! The tailor understood exactly what I wanted and delivered a perfect fit. The doorstep pickup and delivery made it so convenient.",
    rating: 5,
  },
  {
    name: "Arjun Sharma",
    location: "Delhi",
    content: "Amazing platform! Found a great tailor in my area and got my wedding outfits perfectly stitched. Highly recommend TailorConnect.",
    rating: 5,
  },
  {
    name: "Neha Singh",
    location: "Bangalore",
    content: "Quick alterations service saved my day! Got my dress altered in just 24 hours for an important event. Thank you TailorConnect!",
    rating: 5,
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Browse & Select",
    description: "Choose your service and find the perfect tailor near you",
  },
  {
    step: 2,
    title: "Book & Schedule",
    description: "Book your appointment and schedule convenient pickup time",
  },
  {
    step: 3,
    title: "Track Progress",
    description: "Monitor your order status in real-time as work progresses",
  },
  {
    step: 4,
    title: "Receive & Enjoy",
    description: "Get your perfectly tailored garment delivered to your door",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className="h-4 w-4 text-gold fill-current" />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <ServicesGrid />

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy mb-4">How It Works</h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Get your perfect fit in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className={`${step.step === 4 ? 'bg-gold' : 'bg-navy'} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold`}>
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3">{step.title}</h3>
                <p className="text-warm-gray">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy mb-4">What Our Customers Say</h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Real reviews from satisfied customers across the country
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-warm-gray mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-navy font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-navy">{testimonial.name}</div>
                      <div className="text-sm text-warm-gray">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TailorConnect for their tailoring needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/tailors")}
              className="bg-gold text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400"
            >
              Find Tailors Near You
            </Button>
            <Button
              onClick={() => setLocation("/auth?type=tailor")}
              variant="outline"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-navy"
            >
              Join as Tailor Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">TailorConnect</h3>
              <p className="text-gray-400 mb-4">
                Connecting you with skilled tailors for all your clothing needs.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-gold cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-gold cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-gold cursor-pointer" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-gold cursor-pointer" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Custom Stitching</a></li>
                <li><a href="#" className="hover:text-white">Alterations</a></li>
                <li><a href="#" className="hover:text-white">Repairs</a></li>
                <li><a href="#" className="hover:text-white">Uniforms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Partner with Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">&copy; 2024 TailorConnect. All rights reserved.</p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-gray-400">Download our app:</span>
                <div className="flex items-center space-x-2 text-gray-400 hover:text-gold cursor-pointer">
                  <Smartphone className="h-4 w-4" />
                  <span>App Store</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 hover:text-gold cursor-pointer">
                  <Download className="h-4 w-4" />
                  <span>Play Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button className="bg-gold text-white w-14 h-14 rounded-full shadow-lg hover:bg-yellow-400">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
