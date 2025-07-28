import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";
import type { OrderWithDetails } from "@shared/schema";

interface OrderTrackingProps {
  order: OrderWithDetails;
}

const statusSteps = {
  pending: { step: 1, label: "Order Received", icon: CheckCircle },
  confirmed: { step: 2, label: "Confirmed", icon: CheckCircle },
  pickup_scheduled: { step: 3, label: "Pickup Scheduled", icon: Clock },
  in_progress: { step: 4, label: "In Stitching", icon: Package },
  ready: { step: 5, label: "Ready", icon: CheckCircle },
  out_for_delivery: { step: 6, label: "Out for Delivery", icon: Truck },
  delivered: { step: 7, label: "Delivered", icon: CheckCircle },
  cancelled: { step: 0, label: "Cancelled", icon: CheckCircle },
} as const;

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  pickup_scheduled: "bg-orange-100 text-orange-800",
  in_progress: "bg-purple-100 text-purple-800",
  ready: "bg-green-100 text-green-800",
  out_for_delivery: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrderTracking({ order }: OrderTrackingProps) {
  const currentStatus = statusSteps[order.status];
  const progress = currentStatus ? (currentStatus.step / 7) * 100 : 0;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-navy">Order #{order.id.slice(-8)}</CardTitle>
          <Badge className={statusColors[order.status] || statusColors.pending}>
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-warm-gray">
          Placed on {formatDate(order.createdAt)}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-warm-gray">Service</p>
            <p className="font-medium capitalize">{order.serviceType.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-sm text-warm-gray">Tailor</p>
            <p className="font-medium">{order.tailor.user.name}</p>
          </div>
          <div>
            <p className="text-sm text-warm-gray">Amount</p>
            <p className="font-medium text-navy">₹{order.totalAmount}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warm-gray">Order Progress</span>
            <span className="text-sm text-warm-gray">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Status Timeline */}
        <div className="space-y-3">
          {Object.entries(statusSteps).map(([status, details]) => {
            const IconComponent = details.icon;
            const isCompleted = details.step <= (currentStatus?.step || 0);
            const isCurrent = status === order.status;

            return (
              <div
                key={status}
                className={`flex items-center space-x-3 ${
                  isCompleted ? "text-green-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
                <span
                  className={`text-sm ${
                    isCurrent ? "font-semibold text-navy" : ""
                  }`}
                >
                  {details.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <Button variant="outline" size="sm">
            Contact Tailor
          </Button>
          {order.status === "delivered" && !order.review && (
            <Button size="sm" className="bg-navy text-white hover:bg-blue-700">
              Rate Service
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
