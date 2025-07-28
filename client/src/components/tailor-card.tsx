import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { Star, Clock, IndianRupee, MapPin } from "lucide-react";
import type { TailorWithUser } from "@shared/schema";

interface TailorCardProps {
  tailor: TailorWithUser;
}

export default function TailorCard({ tailor }: TailorCardProps) {
  const [, setLocation] = useLocation();

  const handleBookNow = () => {
    setLocation(`/booking/${tailor.id}`);
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

  return (
    <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt={`${tailor.user.name} profile`} />
            <AvatarFallback>{tailor.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy">{tailor.user.name}</h3>
              <Badge variant={tailor.isVerified ? "default" : "secondary"} className="bg-green-100 text-green-800">
                {tailor.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center mt-1">
              <div className="flex">
                {renderStars(parseFloat(tailor.rating || "0"))}
              </div>
              <span className="text-sm text-warm-gray ml-2">
                {tailor.rating} ({tailor.totalReviews} reviews)
              </span>
            </div>
            <div className="flex items-center text-warm-gray text-sm mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              {tailor.location}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {tailor.specializations.map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-warm-gray flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {tailor.avgDeliveryDays} days avg
            </div>
            <div className="text-warm-gray flex items-center">
              <IndianRupee className="h-4 w-4 mr-1" />
              From ₹{tailor.startingPrice}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="text-navy border-navy hover:bg-navy hover:text-white">
            View Profile
          </Button>
          <Button
            onClick={handleBookNow}
            className="bg-navy text-white hover:bg-blue-700"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
