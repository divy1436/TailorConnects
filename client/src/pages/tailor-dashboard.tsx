import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Scissors, 
  CheckCircle, 
  IndianRupee,
  Phone,
  MapPin,
  Plus,
  Settings,
  BarChart3,
  Wallet,
  Star
} from "lucide-react";
import type { OrderWithDetails } from "@shared/schema";

export default function TailorDashboard() {
  const { user, tailor, token } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("orders");

  // Redirect to auth if not logged in
  if (!user || !token) {
    setLocation("/auth");
    return null;
  }

  // Redirect to customer dashboard if user is a customer
  if (user.userType === 'customer') {
    setLocation("/customer-dashboard");
    return null;
  }

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders/tailor", tailor?.id],
    queryFn: async () => {
      if (!tailor) return [];
      const response = await fetch(`/api/orders/tailor/${tailor.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json() as Promise<OrderWithDetails[]>;
    },
    enabled: !!tailor,
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update order status");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/tailor", tailor?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateOrderMutation.mutate({ orderId, status });
  };

  if (!tailor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-6xl mb-4">🧵</div>
          <h2 className="text-2xl font-bold text-navy mb-2">Complete Your Tailor Profile</h2>
          <p className="text-warm-gray mb-6">Set up your tailor profile to start receiving orders.</p>
          <Button className="bg-navy text-white hover:bg-blue-700">
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

  const stats = {
    pendingOrders: orders?.filter(order => order.status === 'pending').length || 0,
    inProgress: orders?.filter(order => 
      ['confirmed', 'pickup_scheduled', 'in_progress'].includes(order.status)
    ).length || 0,
    completed: orders?.filter(order => order.status === 'delivered').length || 0,
    monthlyEarnings: orders?.filter(order => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && 
             orderDate.getFullYear() === now.getFullYear() &&
             order.status === 'delivered';
    }).reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) || 0,
  };

  const activeOrders = orders?.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pickup_scheduled': return 'bg-orange-100 text-orange-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Tailor Dashboard</h1>
          <p className="text-warm-gray">Manage your services and orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src="" alt={tailor.user.name} />
                  <AvatarFallback className="text-xl">
                    {tailor.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-navy">{tailor.user.name}</h3>
                <p className="text-sm text-warm-gray">{tailor.user.email}</p>
                <div className="flex items-center justify-center mt-2">
                  <div className="flex mr-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`h-3 w-3 ${
                        i < Math.floor(parseFloat(tailor.rating || "0")) 
                          ? "text-gold fill-current" 
                          : "text-gray-300"
                      }`} />
                    ))}
                  </div>
                  <span className="text-sm text-warm-gray">{tailor.rating}</span>
                </div>
              </div>

              <nav className="space-y-2">
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "orders" 
                      ? "bg-navy text-white" 
                      : "text-warm-gray hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <Clock className="h-4 w-4 mr-3" />
                  Orders
                </Button>
                <Button
                  variant={activeTab === "services" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "services" 
                      ? "bg-navy text-white" 
                      : "text-warm-gray hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("services")}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Services
                </Button>
                <Button
                  variant={activeTab === "analytics" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "analytics" 
                      ? "bg-navy text-white" 
                      : "text-warm-gray hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Analytics
                </Button>
                <Button
                  variant={activeTab === "earnings" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "earnings" 
                      ? "bg-navy text-white" 
                      : "text-warm-gray hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("earnings")}
                >
                  <Wallet className="h-4 w-4 mr-3" />
                  Earnings
                </Button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 text-white w-12 h-12 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-navy">{stats.pendingOrders}</div>
                    <div className="text-sm text-warm-gray">Pending</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gold text-white w-12 h-12 rounded-lg flex items-center justify-center">
                    <Scissors className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-navy">{stats.inProgress}</div>
                    <div className="text-sm text-warm-gray">In Progress</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500 text-white w-12 h-12 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-navy">{stats.completed}</div>
                    <div className="text-sm text-warm-gray">Completed</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-navy text-white w-12 h-12 rounded-lg flex items-center justify-center">
                    <IndianRupee className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-navy">₹{stats.monthlyEarnings.toLocaleString()}</div>
                    <div className="text-sm text-warm-gray">This Month</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tab Content */}
            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-navy">Active Orders</CardTitle>
                    <Button className="bg-navy text-white hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Order
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activeOrders.length > 0 ? (
                    <div className="space-y-4">
                      {activeOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-navy">Order #{order.id.slice(-8)}</h4>
                              <p className="text-sm text-warm-gray">
                                From {order.customer.name} • {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {order.deliveryDate && new Date(order.deliveryDate) < new Date() && (
                                <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                              )}
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-warm-gray">Service</p>
                              <p className="font-medium capitalize">{order.serviceType.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-warm-gray">Delivery Date</p>
                              <p className={`font-medium ${
                                order.deliveryDate && new Date(order.deliveryDate) < new Date() 
                                  ? "text-red-600" 
                                  : "text-green-600"
                              }`}>
                                {order.deliveryDate ? formatDate(order.deliveryDate) : "TBD"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-warm-gray">Amount</p>
                              <p className="font-medium text-navy">₹{order.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-warm-gray">Status</p>
                              <Select 
                                value={order.status}
                                onValueChange={(value) => handleStatusUpdate(order.id, value)}
                                disabled={updateOrderMutation.isPending}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="pickup_scheduled">Pickup Scheduled</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="ready">Ready</SelectItem>
                                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-warm-gray">
                              <Phone className="h-4 w-4" />
                              <span>{order.customer.phone || "No phone"}</span>
                              <span>•</span>
                              <MapPin className="h-4 w-4" />
                              <span>{order.pickupAddress.slice(0, 50)}...</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-navy text-white hover:bg-blue-700"
                                disabled={updateOrderMutation.isPending}
                              >
                                Update Status
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📋</div>
                      <h3 className="text-xl font-semibold text-navy mb-2">No active orders</h3>
                      <p className="text-warm-gray mb-6">
                        You don't have any active orders at the moment
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "services" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">My Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⚙️</div>
                    <h3 className="text-xl font-semibold text-navy mb-2">Manage Services</h3>
                    <p className="text-warm-gray mb-6">
                      Add and manage your tailoring services and pricing
                    </p>
                    <Button className="bg-navy text-white hover:bg-blue-700">
                      Add Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "analytics" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-navy mb-2">Business Analytics</h3>
                    <p className="text-warm-gray mb-6">
                      View your business performance and customer insights
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "earnings" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-xl font-semibold text-navy mb-2">Earnings Report</h3>
                    <p className="text-warm-gray mb-6">
                      Track your earnings and payment history
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
