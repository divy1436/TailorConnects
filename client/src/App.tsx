import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Tailors from "@/pages/tailors";
import Booking from "@/pages/booking";
import CustomerDashboard from "@/pages/customer-dashboard";
import TailorDashboard from "@/pages/tailor-dashboard";
import Auth from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/tailors" component={Tailors} />
      <Route path="/booking/:tailorId" component={Booking} />
      <Route path="/customer-dashboard" component={CustomerDashboard} />
      <Route path="/tailor-dashboard" component={TailorDashboard} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
