"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "../context/RoleContext";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Users
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();

  const getLinks = () => {
    switch (role) {
      case "system_admin":
        return [
          { name: "Global Analytics", href: "/dashboard", icon: LayoutDashboard },
          { name: "Inventory & FEFO", href: "/inventory", icon: Package },
          { name: "Track Shipments", href: "/track-shipment", icon: Truck },
          { name: "Expiry Tracker", href: "/expiry", icon: Clock },
          { name: "Hospitals", href: "/hospitals", icon: Building2 },
          { name: "Vendors", href: "/vendors", icon: Users },
        ];
      case "admin_hospital":
        return [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, subtext: "Your overview" },
          { name: "Inventory & FEFO", href: "/inventory", icon: Package, subtext: "Batch tracking" },
        ];
      case "vendor_pharma":
        return [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, subtext: "Your overview" },
          { name: "Track Shipments", href: "/track-shipment", icon: Truck, subtext: "Blockchain & cold chain" },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 h-screen sticky top-0 left-0">
      
      {/* Branding */}
      <div className="pt-8 pb-6 px-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">PharmaChain</h1>
        <p className="text-sm text-slate-400 mt-1">Supply Chain OS</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-4">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard' && link.href !== '/');

            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex flex-col px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-teal-900/40 text-white border-l-4 border-teal-500 shadow-sm"
                      : "hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'opacity-75'}`} />
                    <span className="font-medium text-sm">{link.name}</span>
                  </div>
                  {link.subtext && (
                    <span className={`text-xs mt-1 ml-8 ${isActive ? 'text-teal-200/70' : 'text-slate-500'}`}>
                      {link.subtext}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Status Widget */}
      <div className="p-4 m-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">System Operational</p>
            <p className="text-[10px] text-slate-400">Blockchain verified</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-900/50 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-medium text-slate-300">All nodes synced</span>
        </div>
      </div>

    </div>
  );
}
