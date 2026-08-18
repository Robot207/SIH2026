"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Role = "system_admin" | "admin_hospital" | "vendor_pharma" | null;

interface RoleContextType {
  role: Role;
  login: (role: Role) => void;
  logout: () => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedRole = localStorage.getItem("app_role") as Role;
    if (savedRole && ["system_admin", "admin_hospital", "vendor_pharma"].includes(savedRole)) {
      setRole(savedRole);
    }
    setIsLoading(false);
  }, []);

  const login = (newRole: Role) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem("app_role", newRole);
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("app_role");
    router.push("/login");
  };

  return (
    <RoleContext.Provider value={{ role, login, logout, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
