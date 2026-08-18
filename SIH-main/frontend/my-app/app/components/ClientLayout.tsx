"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRole } from "../context/RoleContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useEffect } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isLoading } = useRole();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!isLoading) {
      if (!role && !isLoginPage) {
        router.push("/login");
      }
      if (role && isLoginPage) {
        router.push("/dashboard");
      }
      if (pathname === "/" && role) {
        router.push("/dashboard");
      }
    }
  }, [role, isLoading, pathname, router, isLoginPage]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading...</div>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!role) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
