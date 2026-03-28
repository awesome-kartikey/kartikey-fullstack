"use client";

import {
  createContext,
  useContext,
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
  const [user, setUser] = useState<User | null>(() => {
    if (initialUser) return initialUser;
    if (typeof document === "undefined") return null;

    const userEntry = document.cookie
      .split("; ")
      .find((row) => row.trim().startsWith("user="));

    if (userEntry) {
      try {
        const rawValue = userEntry.split("=").slice(1).join("=");
        const decoded = decodeURIComponent(rawValue);
        return JSON.parse(decoded) as User;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading] = useState(false);
  const [prevInitialUser, setPrevInitialUser] = useState(initialUser);

  // Sync state with props if they change
  if (initialUser !== prevInitialUser) {
    setUser(initialUser || null);
    setPrevInitialUser(initialUser);
  }

  // Optional: Listen for cookie changes manually if needed, 
  // but Prop sync should handle standard Next.js redirects.
  // Note: We already check cookies in the initial state.

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
