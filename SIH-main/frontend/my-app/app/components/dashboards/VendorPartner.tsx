"use client";

import { Package, Truck, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

const orders = [
  {
    id: "order-1001",
    drug: "Amoxicillin 500mg",
    status: "In Transit",
    dest: "St. Mary Regional Hospital",
    qty: "1,000 units",
    expected: "Aug 22",
    hash: "4c3695dc8f9a2b1c4e7d...",
    isDelayed: false
  },
  {
    id: "order-1005",
    drug: "Heparin 5000 IU",
    status: "Delayed",
    dest: "Riverside Medical Center",
    qty: "300 units",
    expected: "Aug 17",
    hash: "9f8a7b6c5d4e3f2a1b0c...",
    isDelayed: true
  }
];

export function VendorPartnerDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Vendor Dashboard</h2>
        <p className="text-slate-300 relative z-10">Welcome, <strong>vendor_pharma</strong>. Manage incoming orders and dispatch shipments.</p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="INCOMING ORDERS" value="2" sub="directed to you" />
        <KPICard title="AWAITING DISPATCH" value="0" sub="status: Placed" />
        <KPICard title="IN TRANSIT" value="2" sub="shipped / moving" icon={<Truck className="w-6 h-6 text-blue-500" />} />
        <KPICard title="DELAYED" value="1" sub="need attention" icon={<AlertTriangle className="w-6 h-6 text-orange-500" />} alert />
      </div>

      {/* Order Action Cards */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 mt-8">Incoming Orders — Action Required</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div>
                  <p className="text-xs font-mono text-slate-500 mb-1">{order.id}</p>
                  <h3 className="text-lg font-bold text-slate-900">{order.drug}</h3>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.isDelayed ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {order.status}
                </span>
              </div>

              {/* Data Grid */}
              <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 flex-1">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Destination</p>
                  <p className="text-sm font-semibold text-slate-900">{order.dest}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Quantity</p>
                  <p className="text-sm font-semibold text-slate-900">{order.qty}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Expected</p>
                  <p className={`text-sm font-semibold ${order.isDelayed ? 'text-red-600' : 'text-slate-900'}`}>{order.expected}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Stage</p>
                  <p className="text-sm font-semibold text-slate-900">{order.status}</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-slate-50 p-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Block Hash</p>
                  <code className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-700 font-mono">{order.hash}</code>
                </div>
                <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
                  Advance to Next Stage <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function KPICard({ title, value, sub, icon, alert }: { title: string, value: string, sub: string, icon?: React.ReactNode, alert?: boolean }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-slate-500 tracking-wider">{title}</h3>
        {icon && (
          <div className="p-2 bg-slate-50 rounded-xl">
            {icon}
          </div>
        )}
        {!icon && (
           <div className="p-2 bg-slate-50 rounded-xl opacity-0"><Package className="w-6 h-6" /></div>
        )}
      </div>
      <div>
        <span className={`text-5xl font-black tracking-tight ${alert ? 'text-red-600' : 'text-slate-900'}`}>{value}</span>
        <p className="text-sm text-slate-500 font-medium mt-2">{sub}</p>
      </div>
    </div>
  );
}
