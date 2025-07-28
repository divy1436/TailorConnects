import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Menu, X, User, Scissors } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/tailors", label: "Find Tailors" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-navy cursor-pointer">TailorConnect</h1>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navigationLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location === link.href
                        ? "text-navy"
                        : "text-warm-gray hover:text-navy"
                    }`}>
                      {link.label}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {user ? (
                <>
                  {user.userType === 'customer' ? (
                    <Link href="/customer-dashboard">
                      <Button variant="ghost" className="text-navy hover:text-gold">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/tailor-dashboard">
                      <Button variant="ghost" className="text-navy hover:text-gold">
                        <Scissors className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button onClick={logout} variant="outline">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/customer-dashboard">
                    <Button variant="ghost" className="text-navy hover:text-gold">
                      <User className="w-4 h-4 mr-2" />
                      Customer
                    </Button>
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/tailor-dashboard">
                    <Button variant="ghost" className="text-warm-gray hover:text-navy">
                      <Scissors className="w-4 h-4 mr-2" />
                      Tailor
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="bg-navy text-white hover:bg-blue-700">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-navy hover:text-gold"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`block px-3 py-2 text-base font-medium transition-colors ${
                      location === link.href
                        ? "text-navy"
                        : "text-warm-gray hover:text-navy"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
              {!user && (
                <Link href="/auth">
                  <Button className="w-full mt-4 bg-navy text-white hover:bg-blue-700">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
