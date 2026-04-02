import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";

export type EventsRole = "CONTENT_MANAGER" | "ADMIN" | "USER";

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname?: string;
  globalRole: string;
  eventsRole?: string;
}

interface EventsProfile {
  id: string;
  role: EventsRole;
}

interface AuthContextType {
  user: User | null;
  eventsProfile: EventsProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, captchaToken?: string | null) => Promise<{ error: { message: string } | null }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown; eventsRole?: string }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isContentManager: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [eventsProfile, setEventsProfile] = useState<EventsProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/manage/events/profile");
      setEventsProfile(data);
    } catch (error) {
      console.error("Failed to fetch events profile:", error);
      setEventsProfile(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          // Verify token and get user profile
          const { data } = await api.post("/auth/verify", { type: "jwt", value: token });
          if (data.user) {
            await fetchProfile();
            setUser(data.user);
          } else {
            localStorage.removeItem("auth_token");
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          localStorage.removeItem("auth_token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, captchaToken?: string | null) => {
    try {
      const [firstname, ...rest] = fullName.split(" ");
      const lastname = rest.join(" ");
      await api.post("/auth/register", { email, password, firstname, lastname, captchaToken });
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      return { error: { message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.accessToken) {
        localStorage.setItem("auth_token", data.accessToken);
        // Await profile fetch so eventsProfile state is ready when navigating
        await fetchProfile();
        if (data.user) setUser(data.user);
        // Return the eventsRole from the JWT payload so the caller can redirect immediately
        const eventsRole: string | undefined = data.user?.eventsRole;
        return { error: null, eventsRole };
      }
      return { error: { message: "Auth failed: No token received" } };
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid credentials or server error";
      return { error: { message } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setEventsProfile(null);
  };

  const isAdmin = () => eventsProfile?.role === "ADMIN";
  const isContentManager = () => eventsProfile?.role === "CONTENT_MANAGER";

  return (
    <AuthContext.Provider value={{ user, eventsProfile, loading, signUp, signIn, signOut, isAdmin, isContentManager }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
