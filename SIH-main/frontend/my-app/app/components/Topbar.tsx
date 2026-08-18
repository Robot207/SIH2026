"use client";

import { useRole } from "../context/RoleContext";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function Topbar() {
  const { role, logout } = useRole();
  const pathname = usePathname();

  const getHeaderDetails = () => {
    switch (role) {
      case "system_admin":
        return {
          title: "Global Analytics",
          subtitle: "System-wide metrics and vendor performance",
          initials: "SU",
          username: "super_admin",
          roleText: "System Administrator",
          avatarBg: "bg-slate-900"
        };
      case "admin_hospital":
        return {
          title: "Dashboard",
          subtitle: "Your role-based overview",
          initials: "AD",
          username: "admin_hospital",
          roleText: "Hospital Administrator",
          avatarBg: "bg-teal-900"
        };
      case "vendor_pharma":
        return {
          title: "Dashboard",
          subtitle: "Your role-based overview",
          initials: "VE",
          username: "vendor_pharma",
          roleText: "Vendor Partner",
          avatarBg: "bg-blue-900"
        };
      default:
        return {
          title: "Dashboard",
          subtitle: "",
          initials: "U",
          username: "user",
          roleText: "User",
          avatarBg: "bg-slate-500"
        };
    }
  };

  const details = getHeaderDetails();

  // If we're on a specific page, override the title
  let displayTitle = details.title;
  if (pathname.includes("/inventory")) displayTitle = "Inventory & FEFO";
  if (pathname.includes("/track-shipment")) displayTitle = "Track Shipments";

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{displayTitle}</h1>
        {details.subtitle && pathname === '/dashboard' && (
          <p className="text-sm text-slate-500 mt-0.5">{details.subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-6">
        
        {/* Live Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">Live</span>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 group relative cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-900">{details.username}</p>
            <p className="text-xs text-slate-500">{details.roleText}</p>
          </div>
          <div className={`w-10 h-10 rounded-full ${details.avatarBg} flex items-center justify-center text-white font-bold tracking-wider shadow-inner`}>
            {details.initials}
          </div>

          {/* Simple Dropdown for Logout */}
          <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
        
      </div>
    </header>
  );
}
