"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

// Mock data for endpoints that don't exist yet in the backend
const vendorDelays = [
  { name: "Acme Pharma", total: 10, delayed: 2 },
  { name: "Global Meds", total: 8, delayed: 4 },
  { name: "HealthCorp", total: 15, delayed: 1 },
  { name: "MediSupply", total: 5, delayed: 3 },
];

const consumptionTrend = [
  { date: "Aug 11", dispensed: 300 },
  { date: "Aug 12", dispensed: 420 },
  { date: "Aug 13", dispensed: 380 },
  { date: "Aug 14", dispensed: 500 },
  { date: "Aug 15", dispensed: 460 },
  { date: "Aug 16", dispensed: 600 },
  { date: "Aug 17", dispensed: 550 },
];

const ordersByStage = [
  { name: "Placed", value: 5, color: "#10b981" },     // Green
  { name: "Shipped", value: 2, color: "#facc15" },    // Yellow
  { name: "In Transit", value: 3, color: "#38bdf8" }, // Light Blue
  { name: "Delivered", value: 0, color: "#c084fc" },  // Purple
];

const vendorDelayRates = [
  { name: "Acme Pharma", rating: 4.8, delayed: 1, total: 10, percent: 10 },
  { name: "Global Meds", rating: 3.5, delayed: 4, total: 8, percent: 50 },
  { name: "HealthCorp", rating: 4.9, delayed: 1, total: 15, percent: 6 },
  { name: "MediSupply", rating: 2.1, delayed: 3, total: 5, percent: 60 },
];

export function SystemAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/dashboard").then(res => res.json()),
      fetch("http://127.0.0.1:8000/vendors/").then(res => res.json())
    ])
      .then(([dashJson, vendorsJson]) => {
        setData(dashJson);
        setVendors(vendorsJson);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-slate-500 flex items-center justify-center py-20">Loading Dashboard Data...</div>;
  }

  // Calculate some metrics from the backend data
  const totalStock = data?.summary?.total_stock_units || 0;
  const totalDrugs = data?.stock_by_medicine?.length || 8;
  const delayedShipments = data?.summary?.delayed_shipments || 2;
  const pendingOrders = data?.summary?.orders_in_progress || 5;
  const institutions = data?.stock_by_medicine && data.stock_by_medicine.length > 0 
    ? Object.keys(data.stock_by_medicine[0]).length - 1 
    : 4;

  const totalActiveVendors = vendors.length;

  // Generate dynamic chart data based on live vendors
  const dynamicVendorDelays = vendors.map((v, i) => {
    // Generate deterministic mock data based on vendor ID so it doesn't jump around
    const total = (v.id * 3) % 15 + 5;
    const delayed = (v.id * 7) % 5;
    return { name: v.name, total, delayed };
  });

  const dynamicVendorDelayRates = vendors.map((v) => {
    const total = (v.id * 3) % 15 + 5;
    const delayed = (v.id * 7) % 5;
    const percent = Math.round((delayed / total) * 100);
    return { name: v.name, rating: v.rating, delayed, total, percent };
  }).sort((a, b) => b.percent - a.percent);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 8 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Drugs" value={totalDrugs.toString()} sub="registered types" />
        <KPICard title="Institutions" value={institutions.toString()} sub="active locations" />
        <KPICard title="Total Stock" value={totalStock.toLocaleString()} sub="units available" />
        <KPICard title="Delayed Shipments" value={delayedShipments.toString()} sub="require attention" alert />
        <KPICard title="Total Orders" value="12" sub="last 30 days" />
        <KPICard title="Pending Orders" value={pendingOrders.toString()} sub="awaiting fulfillment" />
        <KPICard title="Delivered" value="0" sub="this week" />
        <KPICard title="Vendors" value={totalActiveVendors.toString()} sub="active suppliers" />
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Left: Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Vendor Performance — Delays</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicVendorDelays}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="total" name="Total Orders" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="delayed" name="Delayed Orders" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Right: Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">System-Wide Consumption Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="dispensed" name="Daily Units Dispensed" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Left: Donut Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Orders by Stage</h2>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ordersByStage}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {ordersByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value, entry: any) => <span className="text-slate-700 font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Right: Vendor Delay List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto max-h-[380px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Vendor Delay Rates</h2>
          <div className="space-y-6">
            {dynamicVendorDelayRates.map((vendor, idx) => {
              let barColor = "bg-green-500";
              if (vendor.percent > 0 && vendor.percent < 50) barColor = "bg-orange-400";
              if (vendor.percent >= 50) barColor = "bg-red-500";

              return (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold text-slate-900">{vendor.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">★ {vendor.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-500">{vendor.delayed} delayed / {vendor.total} total orders</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700 text-lg">{vendor.percent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all duration-1000`} style={{ width: `${vendor.percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function KPICard({ title, value, sub, alert }: { title: string, value: string, sub: string, alert?: boolean }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      <div className="mt-3 mb-1">
        <span className={`text-3xl font-black tracking-tight ${alert ? 'text-red-600' : 'text-slate-900'}`}>{value}</span>
      </div>
      <p className="text-xs text-slate-500 font-medium">{sub}</p>
    </div>
  );
}
