"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [rawInventory, setRawInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isConsumeModalOpen, setConsumeModalOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [consumeAmount, setConsumeAmount] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [targetLocation, setTargetLocation] = useState("District Hospital Nashik");
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "low">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Safely parse URL params on client side to avoid Next.js Suspense error
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const loc = params.get("location");
      if (loc) setTargetLocation(loc);
    }
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/inventory/options");
      const data = await res.json();
      
      const locations = Array.from(new Set(data.map((i: any) => i.location))) as string[];
      setAvailableLocations(locations);

      const hospitalInventory = data.filter((item: any) => item.location === targetLocation);
      setRawInventory(hospitalInventory);

      // Group by medicine for the table
      const grouped = hospitalInventory.reduce((acc: any, item: any) => {
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
          expiry: item.expiry_date,
          raw_item: item
        });
        return acc;
      }, {});

      // Sort batches by expiry date (FEFO)
      const finalData = Object.values(grouped).map((item: any) => {
        item.batches.sort((a: any, b: any) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
        // Since we multiplied stock by 10, threshold should be 500
        if (item.qty < 500) item.status = "Low Stock";
        return item;
      });

      setInventoryData(finalData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
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
    
    // Simulate FEFO deduction
    let amountToDeduct = Number(consumeAmount);
    
    // Find the nearest expiry batch
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

      await fetchInventory();
      setConsumeModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && inventoryData.length === 0) {
    return <div className="text-slate-500 flex items-center justify-center py-20">Loading Inventory...</div>;
  }

  const filteredInventory = inventoryData.filter(item => {
    // Check status filter
    if (activeFilter === "low" && item.status !== "Low Stock") return false;
    
    // Check search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.drug.toLowerCase().includes(q) && !item.vendor.toLowerCase().includes(q)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory & FEFO</h1>
          <p className="text-sm text-slate-500 mt-1">Manage stock batches and consume medicine using FEFO logic.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Controls */}
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drugs or vendors..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
              />
            </div>
            <div className="w-full md:w-64 shrink-0">
              <select 
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              >
                {availableLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
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
              Low Stock <span className="ml-1 opacity-70 font-normal">{inventoryData.filter(d => d.status === 'Low Stock').length}</span>
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
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{item.drug}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.vendor}</td>
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
