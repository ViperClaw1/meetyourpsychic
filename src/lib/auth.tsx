import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "client" | "psychic" | "admin";

export const roleHome: Record<Role, string> = {
  client: "/client-dashboard",
  psychic: "/psychic-dashboard",
  admin: "/admin-dashboard",
};

export const roleLabel: Record<Role, string> = {
  client: "Client",
  psychic: "Psychic Advisor",
  admin: "Super Admin",
};

const STORAGE_KEY = "myp.mock.role";

type AuthValue = {
  role: Role | null;
  ready: boolean;
  signIn: (role: Role) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Role | null;
    if (stored === "client" || stored === "psychic" || stored === "admin") setRole(stored);
    setReady(true);
  }, []);

  const signIn = useCallback((next: Role) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setRole(next);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setRole(null);
  }, []);

  const value = useMemo(() => ({ role, ready, signIn, signOut }), [role, ready, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
