import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import OrderTracking from "@/components/order-tracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { 
  ShoppingBag, 
  CheckCircle, 
  IndianRupee, 
  Heart, 
  User, 
  Ruler,
  Star,
  Calendar,
  Plus
} from "lucide-react";
import type { OrderWithDetails } from "@shared/schema";

export default function CustomerDashboard() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("orders");

  // Redirect to auth if not logged in
  if (!user || !token) {
    setLocation("/auth");
    return null;
  }

  // Redirect to tailor dashboard if user is a tailor
  if (user.userType === 'tailor') {
    setLocation("/tailor-dashboard");
    return null;
  }

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders/customer"],
    queryFn: async () => {
      const response = await fetch("/api/orders/customer", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json() as Promise<OrderWithDetails[]>;
    },
  });

  const stats = {
    totalOrders: orders?.length || 0,
    completedOrders: orders?.filter(order => order.status === 'delivered').length || 0,
    totalSpent: orders?.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) || 0,
  };

  const recentOrders = orders?.slice(0, 5) || [];
  const activeOrders = orders?.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">My Dashboard</h1>
          <p className="text-warm-gray">Manage your orders and profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-navy">{user.name}</h3>
                <p className="text-sm text-warm-gray">{user.email}</p>
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
                  <ShoppingBag className="h-4 w-4 mr-3" />
                  My Orders
                </Button>
                <Button
                  variant={activeTab === "measurements" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "measurements" 
                      ? "bg-navy text-white" 
                      : "text-warm-gray hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("measurements")}
                >
                  <Ruler className="h-4 w-4 mr-3" />
                  Measurements
                </Button>
                <Button
                  variant={activeTab === "favorites" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "favorites" 
                      ? "bg-navy text-white" 
                      : "text-warm-gray hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("favorites")}
                >
                  <Heart className="h-4 w-4 mr-3" />
                  Favorites
                </Button>
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "profile" 
                      ? "bg-navy text-white" 
                      : "text-warm-gray hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </Button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-navy text-white w-12 h-12 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-navy">{stats.totalOrders}</div>
                    <div className="text-sm text-warm-gray">Total Orders</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500 text-white w-12 h-12 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-navy">{stats.completedOrders}</div>
                    <div className="text-sm text-warm-gray">Completed</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gold text-white w-12 h-12 rounded-lg flex items-center justify-center">
                    <IndianRupee className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-navy">₹{stats.totalSpent.toLocaleString()}</div>
                    <div className="text-sm text-warm-gray">Total Spent</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tab Content */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-navy">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setLocation("/tailors")}
                      className="bg-navy text-white hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Order
                    </Button>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Pickup
                    </Button>
                    <Button variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      Rate Service
                    </Button>
                  </div>
                </Card>

                {/* Active Orders */}
                {activeOrders.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">Active Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activeOrders.map((order) => (
                          <OrderTracking key={order.id} order={order} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Orders List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-navy">Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <Skeleton className="h-6 w-1/3" />
                              <Skeleton className="h-6 w-20" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-navy">Order #{order.id.slice(-8)}</h4>
                                <p className="text-sm text-warm-gray">
                                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <Badge 
                                className={`${
                                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {order.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {order.status === 'delivered' && order.review && (
                                  <div className="flex items-center space-x-2">
                                    <div className="flex">
                                      {Array.from({ length: order.review.rating }, (_, i) => (
                                        <Star key={i} className="h-3 w-3 text-gold fill-current" />
                                      ))}
                                    </div>
                                    <span className="text-sm text-warm-gray">Rated</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                                {order.status === 'delivered' && (
                                  <Button 
                                    size="sm" 
                                    className="bg-navy text-white hover:bg-blue-700"
                                  >
                                    Reorder
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-navy mb-2">No orders yet</h3>
                        <p className="text-warm-gray mb-6">
                          Start by finding a tailor and placing your first order
                        </p>
                        <Button 
                          onClick={() => setLocation("/tailors")}
                          className="bg-navy text-white hover:bg-blue-700"
                        >
                          Browse Tailors
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "measurements" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Saved Measurements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📏</div>
                    <h3 className="text-xl font-semibold text-navy mb-2">No measurements saved</h3>
                    <p className="text-warm-gray mb-6">
                      Save your measurements for faster future orders
                    </p>
                    <Button className="bg-navy text-white hover:bg-blue-700">
                      Add Measurements
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "favorites" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Favorite Tailors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-xl font-semibold text-navy mb-2">No favorites yet</h3>
                    <p className="text-warm-gray mb-6">
                      Save your favorite tailors for quick access
                    </p>
                    <Button 
                      onClick={() => setLocation("/tailors")}
                      className="bg-navy text-white hover:bg-blue-700"
                    >
                      Browse Tailors
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Name</Label>
                        <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                          {user.name}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                          {user.email}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Phone</Label>
                        <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                          {user.phone || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Account Type</Label>
                        <div className="mt-1 p-3 border rounded-lg bg-gray-50 capitalize">
                          {user.userType}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-navy text-white hover:bg-blue-700">
                      Edit Profile
                    </Button>
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
