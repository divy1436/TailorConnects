import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { User, TailorWithUser } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  tailor: TailorWithUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tailor, setTailor] = useState<TailorWithUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch("/api/users/me", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          
          const data = await response.json();
          setUser(data.user);
          setTailor(data.tailor);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);

    // If user is a tailor, fetch tailor profile
    if (data.user.userType === 'tailor') {
      try {
        const tailorResponse = await fetch("/api/users/me", {
          headers: {
            "Authorization": `Bearer ${data.token}`,
          },
        });
        
        if (tailorResponse.ok) {
          const tailorData = await tailorResponse.json();
          setTailor(tailorData.tailor);
        }
      } catch (error) {
        console.error("Failed to fetch tailor profile:", error);
      }
    }
  };

  const register = async (userData: any) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);

    // If registering as tailor, create tailor profile
    if (userData.userType === 'tailor') {
      try {
        const tailorData = {
          userId: data.user.id,
          businessName: userData.businessName || null,
          location: userData.location,
          address: userData.address || null,
          specializations: userData.specializations || [],
          description: userData.description || null,
          isVerified: false,
          avgDeliveryDays: 3,
          startingPrice: "299",
        };

        const tailorResponse = await fetch("/api/tailors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.token}`,
          },
          body: JSON.stringify(tailorData),
        });

        if (tailorResponse.ok) {
          // Fetch complete tailor profile
          const userResponse = await fetch("/api/users/me", {
            headers: {
              "Authorization": `Bearer ${data.token}`,
            },
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setTailor(userData.tailor);
          }
        }
      } catch (error) {
        console.error("Failed to create tailor profile:", error);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setTailor(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{
      user,
      tailor,
      token,
      login,
      register,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
