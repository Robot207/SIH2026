"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle, Search, Filter } from "lucide-react";

export default function ExpiryTrackerPage() {
  const [expiryData, setExpiryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/expiry/")
      .then(res => res.json())
      .then(data => {
        setExpiryData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-slate-500 flex items-center justify-center py-20">Loading Expiry Data...</div>;
  }

  const expiredCount = expiryData.filter(i => i.status === "Expired").length;
  const criticalCount = expiryData.filter(i => i.status === "Expiring < 3 months").length;
  const warningCount = expiryData.filter(i => i.status === "Expiring 3–6 months").length;

  const filteredData = expiryData.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.medicine.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
  });

  const handleExport = () => {
    // Generate CSV string
    const headers = ["Drug", "Location", "Expiry Date", "Days Remaining", "Status"];
    const rows = filteredData.map(item => [
      `"${item.medicine}"`, 
      `"${item.location}"`, 
      `"${item.expiry_date}"`, 
      item.days_remaining, 
      `"${item.status}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expiry_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expiry & Wastage Tracker</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor upcoming drug expirations across all institutions to enforce FEFO.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
        >
          <Filter className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-900">Already Expired</h3>
          </div>
          <p className="text-4xl font-black text-red-700">{expiredCount}</p>
          <p className="text-sm font-medium text-red-800 mt-1">Requires immediate disposal</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-orange-900">Critical (&lt; 3 Months)</h3>
          </div>
          <p className="text-4xl font-black text-orange-700">{criticalCount}</p>
          <p className="text-sm font-medium text-orange-800 mt-1">Prioritize for consumption</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-900">Warning (3-6 Months)</h3>
          </div>
          <p className="text-4xl font-black text-amber-700">{warningCount}</p>
          <p className="text-sm font-medium text-amber-800 mt-1">Monitor distribution</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by drug or location..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">DRUG</th>
                <th className="px-6 py-4">LOCATION</th>
                <th className="px-6 py-4">EXPIRY DATE</th>
                <th className="px-6 py-4">DAYS REMAINING</th>
                <th className="px-6 py-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{item.medicine}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.location}</td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-700">{item.expiry_date}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{item.days_remaining}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">No expiry records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = "bg-green-100 text-green-700 border-green-200";
  if (status === "Expired") color = "bg-red-100 text-red-700 border-red-200";
  if (status === "Expiring < 3 months") color = "bg-orange-100 text-orange-700 border-orange-200";
  if (status === "Expiring 3–6 months") color = "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
      {status}
    </span>
  );
}
