import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Scissors, User, Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: "customer" as "customer" | "tailor",
    // Tailor specific fields
    businessName: "",
    location: "",
    address: "",
    specializations: [] as string[],
    description: "",
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Login Successful",
        description: "Welcome back to TailorConnect!",
      });
      
      // Redirect based on user type after login
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        userType: registerData.userType,
      };

      await register(userData);
      
      toast({
        title: "Registration Successful",
        description: "Welcome to TailorConnect!",
      });

      // Redirect based on user type
      if (registerData.userType === 'tailor') {
        setLocation("/tailor-dashboard");
      } else {
        setLocation("/customer-dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (field: keyof typeof loginData, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterInputChange = (field: keyof typeof registerData, value: any) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  const specializationOptions = [
    "Men's Wear",
    "Women's Wear", 
    "Alterations",
    "Repairs",
    "Uniforms",
    "Traditional Wear",
    "Western Wear",
    "Bridal Wear",
    "Formal Wear",
    "Casual Wear"
  ];

  const toggleSpecialization = (spec: string) => {
    setRegisterData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy mb-2">TailorConnect</h1>
          <p className="text-warm-gray">
            {activeTab === "login" 
              ? "Sign in to your account" 
              : "Create your account"
            }
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => handleLoginInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => handleLoginInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-navy text-white hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="text-center">
                  <Button variant="link" className="text-navy">
                    Forgot password?
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* User Type Selection */}
                  <div>
                    <Label>I am a</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <Button
                        type="button"
                        variant={registerData.userType === "customer" ? "default" : "outline"}
                        className={`${
                          registerData.userType === "customer"
                            ? "bg-navy text-white"
                            : "border-navy text-navy hover:bg-navy hover:text-white"
                        }`}
                        onClick={() => handleRegisterInputChange("userType", "customer")}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Customer
                      </Button>
                      <Button
                        type="button"
                        variant={registerData.userType === "tailor" ? "default" : "outline"}
                        className={`${
                          registerData.userType === "tailor"
                            ? "bg-navy text-white"
                            : "border-navy text-navy hover:bg-navy hover:text-white"
                        }`}
                        onClick={() => handleRegisterInputChange("userType", "tailor")}
                      >
                        <Scissors className="h-4 w-4 mr-2" />
                        Tailor
                      </Button>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerData.name}
                        onChange={(e) => handleRegisterInputChange("name", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-email">Email *</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => handleRegisterInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={registerData.phone}
                        onChange={(e) => handleRegisterInputChange("phone", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={registerData.password}
                          onChange={(e) => handleRegisterInputChange("password", e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => handleRegisterInputChange("confirmPassword", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Tailor Specific Fields */}
                  {registerData.userType === "tailor" && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-navy">Tailor Information</h4>
                      
                      <div>
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input
                          id="business-name"
                          type="text"
                          placeholder="Your shop/business name"
                          value={registerData.businessName}
                          onChange={(e) => handleRegisterInputChange("businessName", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          type="text"
                          placeholder="City, Area or Pincode"
                          value={registerData.location}
                          onChange={(e) => handleRegisterInputChange("location", e.target.value)}
                          required={registerData.userType === "tailor"}
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Full Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Complete business address"
                          value={registerData.address}
                          onChange={(e) => handleRegisterInputChange("address", e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label>Specializations</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {specializationOptions.map((spec) => (
                            <Button
                              key={spec}
                              type="button"
                              variant={registerData.specializations.includes(spec) ? "default" : "outline"}
                              size="sm"
                              className={`text-xs ${
                                registerData.specializations.includes(spec)
                                  ? "bg-navy text-white"
                                  : "border-gray-300 hover:border-navy"
                              }`}
                              onClick={() => toggleSpecialization(spec)}
                            >
                              {spec}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">About Your Services</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of your tailoring experience and services"
                          value={registerData.description}
                          onChange={(e) => handleRegisterInputChange("description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-navy text-white hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-warm-gray">
          <p>
            {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="text-navy p-0 h-auto font-normal underline"
              onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
            >
              {activeTab === "login" ? "Sign up" : "Sign in"}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
