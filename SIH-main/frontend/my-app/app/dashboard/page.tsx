"use client";

import { useRole } from "../context/RoleContext";
import { SystemAdminDashboard } from "../components/dashboards/SystemAdmin";
import { HospitalAdminDashboard } from "../components/dashboards/HospitalAdmin";
import { VendorPartnerDashboard } from "../components/dashboards/VendorPartner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { role, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !role) {
      router.push("/login");
    }
  }, [role, isLoading, router]);

  if (isLoading || !role) {
    return <div className="h-full flex items-center justify-center text-slate-500">Loading Dashboard...</div>;
  }

  return (
    <>
      {role === "system_admin" && <SystemAdminDashboard />}
      {role === "admin_hospital" && <HospitalAdminDashboard />}
      {role === "vendor_pharma" && <VendorPartnerDashboard />}
    </>
  );
}
