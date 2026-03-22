"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setUser(initialUser || null);
    setLoading(false);
  }, [initialUser]);

  // Optional: Listen for cookie changes manually if needed, 
  // but Prop sync should handle standard Next.js redirects.
  useEffect(() => {
    if (!user) {
      const userEntry = document.cookie
        .split("; ")
        .find((row) => row.trim().startsWith("user="));

      if (userEntry) {
        try {
          const rawValue = userEntry.split("=").slice(1).join("=");
          const decoded = decodeURIComponent(rawValue);
          const parsed = JSON.parse(decoded) as User;
          setUser(parsed);
        } catch {
          setUser(null);
        }
      }
    }
  }, [user]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "DELETE" });
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth() was called outside of <AuthProvider>. Make sure <AuthProvider> wraps your app in app/layout.tsx.",
    );
  }

  return context;
}
