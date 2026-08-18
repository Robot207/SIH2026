"use client";

import { Building2, Activity, MapPin, Search, ArrowUpRight } from "lucide-react";
import Link from "next/link";

// Mock data as backend doesn't have a hospitals API yet
const hospitals = [
  { id: 1, name: "AIIMS New Delhi", type: "Central Government", location: "New Delhi, Delhi", beds: 2200, status: "Healthy" },
  { id: 2, name: "Safdarjung Hospital", type: "Central Government", location: "New Delhi, Delhi", beds: 1531, status: "Low Stock" },
  { id: 3, name: "J.J. Hospital Mumbai", type: "State Government", location: "Mumbai, Maharashtra", beds: 2844, status: "Healthy" },
  { id: 4, name: "District Hospital Nashik", type: "State Government", location: "Nashik, Maharashtra", beds: 800, status: "Healthy" },
  { id: 5, name: "Rajiv Gandhi Super Speciality", type: "State Government", location: "Taharpur, Delhi", beds: 650, status: "Critical Shortage" },
  { id: 6, name: "State Civil Hospital", type: "State Government", location: "Kolkata, West Bengal", beds: 1200, status: "Healthy" },
  { id: 7, name: "Rural PHC Karjat", type: "Primary Health Centre", location: "Karjat, Maharashtra", beds: 30, status: "Low Stock" },
  { id: 8, name: "City General Hospital", type: "Municipal Corporation", location: "Bangalore, Karnataka", beds: 900, status: "Healthy" },
];

export default function HospitalsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Institutions & Hospitals</h1>
          <p className="text-slate-500 font-medium mt-1">Manage connected healthcare facilities across the network.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search hospitals..." 
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => {
          let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
          if (hospital.status === "Low Stock") statusColor = "bg-orange-50 text-orange-700 border-orange-200";
          if (hospital.status === "Critical Shortage") statusColor = "bg-red-50 text-red-700 border-red-200";

          return (
            <div key={hospital.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold border border-slate-200">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                    {hospital.status}
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-slate-900 truncate">{hospital.name}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 mb-4">{hospital.type}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{hospital.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{hospital.beds} Bed Capacity</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Node ID: IN-{1000 + hospital.id}</span>
                <Link href={`/inventory?location=${encodeURIComponent(hospital.name)}`} className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors">
                  View Inventory <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
