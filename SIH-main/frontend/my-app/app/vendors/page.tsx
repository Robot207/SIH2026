"use client";

import { useEffect, useState } from "react";
import { Users, Star, MapPin, Mail, ArrowUpRight } from "lucide-react";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", email: "", latitude: 20.5937, longitude: 78.9629, rating: 4.0 });

  const getVendorAddress = (name: string) => {
    if (name.includes("Acme")) return "Mumbai Hub, Maharashtra";
    if (name.includes("Global")) return "Delhi Central, New Delhi";
    if (name.includes("Health")) return "Bangalore Depot, Karnataka";
    if (name.includes("Medi")) return "Hyderabad Hub, Telangana";
    return "Central Office, India";
  };

  const fetchVendors = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/vendors/")
      .then(res => res.json())
      .then(data => {
        setVendors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("http://127.0.0.1:8000/vendors/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVendor)
      });
      setIsAddModalOpen(false);
      fetchVendors();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500 flex items-center justify-center py-20">Loading Vendors...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vendor Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and evaluate pharmaceutical suppliers across the network.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
        >
          <Users className="w-4 h-4" /> Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold text-xl border border-teal-100">
                  {vendor.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {vendor.rating.toFixed(1)}
                </div>
              </div>
              
              <h2 className="text-lg font-bold text-slate-900">{vendor.name}</h2>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Lat: {vendor.latitude.toFixed(2)}, Lng: {vendor.longitude.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Contract</span>
              <button 
                onClick={() => setSelectedVendor(vendor)}
                className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
              >
                View Details <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {vendors.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Vendors Found</h3>
            <p className="text-slate-500 mt-1">There are currently no vendors registered in the system.</p>
          </div>
        )}
      </div>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-slate-900">{selectedVendor.name}</h3>
                <div className="flex items-center gap-1 text-amber-500 mt-1">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-700">{selectedVendor.rating.toFixed(1)} / 5.0 Rating</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold text-xl border border-teal-100">
                {selectedVendor.name.charAt(0)}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Information</p>
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Mail className="w-5 h-5 text-teal-600" />
                  {selectedVendor.email}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Address (Origin)</p>
                <div className="flex items-start gap-3 text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p>{getVendorAddress(selectedVendor.name)}</p>
                    <p className="text-xs text-slate-500 mt-1">Coordinates: {selectedVendor.latitude.toFixed(4)}, {selectedVendor.longitude.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedVendor(null)}
                className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add New Vendor</h3>
              <p className="text-sm text-slate-500 mt-1">Register a new pharmaceutical supplier to the network.</p>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={handleAddSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">VENDOR NAME</label>
                <input 
                  type="text" 
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">LATITUDE</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={newVendor.latitude}
                    onChange={(e) => setNewVendor({...newVendor, latitude: parseFloat(e.target.value)})}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">LONGITUDE</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={newVendor.longitude}
                    onChange={(e) => setNewVendor({...newVendor, longitude: parseFloat(e.target.value)})}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" disabled={isSubmitting}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
