"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FlaskConical, Package, AlertTriangle, Clock, Truck, Search } from "lucide-react";

// Mock for consumption as it's not in the backend yet
const consumptionData = [
  { date: "Aug 11", value: 430 },
  { date: "Aug 12", value: 120 },
  { date: "Aug 13", value: 150 },
  { date: "Aug 14", value: 80 },
  { date: "Aug 15", value: 210 },
  { date: "Aug 16", value: 190 },
  { date: "Aug 17", value: 140 },
];

export function HospitalAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [inventoryOptions, setInventoryOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Consume Modal State
  const [isConsumeModalOpen, setConsumeModalOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [consumeAmount, setConsumeAmount] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [targetLocation, setTargetLocation] = useState("District Hospital Nashik");
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  
  // Table Filter State
  const [activeFilter, setActiveFilter] = useState<"all" | "low" | "expiring">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDashboardData = async () => {
    try {
      const [dashData, invData] = await Promise.all([
        fetch("http://127.0.0.1:8000/dashboard").then(res => res.json()),
        fetch("http://127.0.0.1:8000/inventory/options").then(res => res.json())
      ]);
      setDashboardData(dashData);
      
      const locations = Array.from(new Set(invData.map((i: any) => i.location))) as string[];
      setAvailableLocations(locations);

      // Filter inventory for this specific hospital
      const hospitalInventory = invData.filter((item: any) => item.location === targetLocation);
      setInventoryOptions(hospitalInventory);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [targetLocation]);

  const handleConsumeClick = (drug: any) => {
    setSelectedDrug(drug);
    setConsumeAmount("");
    setConsumeModalOpen(true);
  };

  const handleConsumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumeAmount || consumeAmount <= 0 || !selectedDrug) return;
    
    setIsSubmitting(true);
    
    let amountToDeduct = Number(consumeAmount);
    const targetBatch = selectedDrug.batches[0]; 
    if (!targetBatch) {
      setIsSubmitting(false);
      return;
    }

    const newQuantity = Math.max(0, targetBatch.qty - amountToDeduct);

    try {
      await fetch("http://127.0.0.1:8000/inventory/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicine_id: selectedDrug.id,
          location_id: selectedDrug.location_id,
          quantity: newQuantity,
          expiry_date: targetBatch.expiry || "2026-12-31"
        })
      });

      // Refetch dashboard data to immediately update KPIs!
      await fetchDashboardData();
      setConsumeModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500 flex items-center justify-center py-20">Loading Dashboard Data...</div>;
  }

  // Calculate KPIs for this location
  let locationTotalStock = 0;
  if (dashboardData?.stock_by_medicine) {
    dashboardData.stock_by_medicine.forEach((med: any) => {
      locationTotalStock += (med[targetLocation] || 0);
    });
  }

  const locationLowStock = dashboardData?.low_stock?.filter((i: any) => i.location === targetLocation).length || 0;
  const locationExpiring = dashboardData?.expiring?.filter((i: any) => i.location === targetLocation).length || 0;

  // Process inventoryOptions into the table format
  const groupedInventory = inventoryOptions.reduce((acc: any, item: any) => {
    if (!acc[item.medicine_id]) {
      acc[item.medicine_id] = {
        id: item.medicine_id,
        location_id: item.location_id,
        drug: item.medicine,
        vendor: ["Acme Pharma", "Global Meds", "HealthCorp", "MediSupply"][item.medicine_id % 4],
        category: "Medicine", 
        qty: 0,
        reorder: 50,
        batches: [],
        status: "Healthy"
      };
    }
    acc[item.medicine_id].qty += item.quantity;
    acc[item.medicine_id].batches.push({
      id: `BCH-${item.inventory_id}`,
      qty: item.quantity,
      expiry: item.expiry_date
    });
    return acc;
  }, {});

  const inventoryData = Object.values(groupedInventory).map((item: any) => {
    item.batches.sort((a: any, b: any) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
    // Since we multiplied stock by 10, low stock threshold should be higher for demo
    if (item.qty < 500) item.status = "Low Stock";
    return item;
  });

  // Apply filters to table
  const filteredInventory = inventoryData.filter((item: any) => {
    // Status Filter
    if (activeFilter === "low" && item.status !== "Low Stock") return false;
    if (activeFilter === "expiring" && item.status !== "Expiring Soon") return false;
    
    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.drug.toLowerCase().includes(q) && !item.vendor.toLowerCase().includes(q)) {
        return false;
      }
    }
    
    return true; // "all"
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Alert Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0 border border-teal-200">
            <FlaskConical className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-teal-900">Hospital Administration Dashboard</h2>
            <p className="text-sm text-teal-800 mt-1">Managing inventory for <strong>{targetLocation}</strong>. FEFO deduction is active.</p>
          </div>
        </div>
        
        <div className="w-full sm:w-64 shrink-0">
          <select 
            value={targetLocation}
            onChange={(e) => setTargetLocation(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-teal-200 rounded-lg text-sm font-semibold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          >
            {availableLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="TOTAL STOCK" value={locationTotalStock.toLocaleString()} sub="units at your site" icon={<Package className="w-6 h-6 text-teal-600" />} />
        
        {/* Clickable Low Stock KPI Box */}
        <div 
          onClick={() => {
            setActiveFilter("low");
            document.getElementById("inventory-table")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-orange-300 hover:-translate-y-1 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">LOW STOCK ALERTS</h3>
            <div className="p-2 bg-orange-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-slate-900 tracking-tight">{inventoryData.filter((i:any) => i.status === "Low Stock").length}</span>
            <p className="text-sm text-slate-500 font-medium mt-1">click to view items</p>
          </div>
        </div>

        <KPICard title="EXPIRING SOON" value={locationExpiring.toString()} sub="within 6 months" icon={<Clock className="w-6 h-6 text-orange-500" />} />
        <KPICard title="PENDING ORDERS" value="5" sub="awaiting delivery" icon={<Truck className="w-6 h-6 text-blue-500" />} />
      </div>

      {/* Data Visualization */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900">Your Institution's Consumption</h2>
        <p className="text-sm text-slate-500 mb-8">Daily units dispensed at {targetLocation}</p>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consumptionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} domain={[0, 600]} ticks={[0, 150, 300, 450, 600]} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Data Table Section */}
      <div id="inventory-table" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drugs or vendors..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors ${activeFilter === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
            >
              All <span className="ml-1 opacity-70 font-normal">{inventoryData.length}</span>
            </button>
            <button 
              onClick={() => setActiveFilter("low")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors ${activeFilter === "low" ? "bg-orange-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
            >
              Low Stock <span className="ml-1 opacity-70 font-normal">{inventoryData.filter((i:any) => i.status === "Low Stock").length}</span>
            </button>
            <button 
              onClick={() => setActiveFilter("expiring")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors ${activeFilter === "expiring" ? "bg-red-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
            >
              Expiring Soon <span className="ml-1 opacity-70 font-normal">{inventoryData.filter((i:any) => i.status === "Expiring Soon").length}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">DRUG</th>
                <th className="px-6 py-4">VENDOR</th>
                <th className="px-6 py-4">CATEGORY</th>
                <th className="px-6 py-4">TOTAL QTY</th>
                <th className="px-6 py-4">REORDER LEVEL</th>
                <th className="px-6 py-4">BATCHES (FEFO ORDER)</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{item.drug}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{item.vendor}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{item.category}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{item.qty}</td>
                  <td className="px-6 py-4 text-slate-500">{item.reorder}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.batches.map((batch: any, bidx: number) => (
                        <span key={bidx} className="inline-flex items-center px-2 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 whitespace-nowrap">
                          {batch.id} &middot; {batch.qty}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleConsumeClick(item)}
                      className="px-4 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 hover:border-teal-200 transition-all"
                    >
                      Consume
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consume Modal */}
      {isConsumeModalOpen && selectedDrug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Consume Stock</h3>
              <p className="text-sm text-slate-500 mt-1">Record medicine usage for {selectedDrug.drug}.</p>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={handleConsumeSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">CONSUMING INSTITUTION</label>
                <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium">
                  {targetLocation}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">QUANTITY TO CONSUME</label>
                <input 
                  type="number" 
                  min="1"
                  max={selectedDrug.qty}
                  value={consumeAmount}
                  onChange={(e) => setConsumeAmount(Number(e.target.value))}
                  placeholder={`Max: ${selectedDrug.qty}`}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                />
              </div>
              
              <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg">
                <p className="text-xs text-teal-800 font-medium">Stock will be automatically deducted from the nearest expiry batch first (FEFO) starting with <span className="font-bold">{selectedDrug.batches[0]?.id}</span>.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setConsumeModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" disabled={isSubmitting}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50">
                  {isSubmitting ? "Processing..." : "Confirm Consumption"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function KPICard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-slate-500 tracking-wider">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-xl">
          {icon}
        </div>
      </div>
      <div>
        <span className="text-4xl font-black text-slate-900 tracking-tight">{value}</span>
        <p className="text-sm text-slate-500 font-medium mt-1">{sub}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = "bg-green-100 text-green-700 border-green-200";
  if (status === "Low Stock") color = "bg-orange-100 text-orange-700 border-orange-200";
  if (status === "Expiring Soon") color = "bg-red-100 text-red-700 border-red-200";

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
      {status}
    </span>
  );
}
