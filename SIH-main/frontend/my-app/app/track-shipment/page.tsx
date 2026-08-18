"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, Thermometer, CheckCircle2, Navigation, Plus, ArrowRight, List, AlertCircle } from "lucide-react";
import { useRole } from "../context/RoleContext";
import dynamic from "next/dynamic";

// Dynamically import MapRoute with SSR disabled because Leaflet uses window
const MapRoute = dynamic(() => import("../components/MapRoute"), { ssr: false });

// Master list of shipments with coordinates
// Vendors:
// Acme Pharma (Mumbai): 19.0760, 72.8777
// Global Meds (Delhi): 28.7041, 77.1025
// HealthCorp (Bangalore): 12.9716, 77.5946
// MediSupply (Hyderabad): 17.3850, 78.4867
const initialShipments = [
    { id: "SHP-9921", drug: "Amoxicillin 500mg", origin: "Mumbai Hub", dest: "AIIMS New Delhi", status: 2, expected: "Today, 4:00 PM", vendor: "Acme Pharma", temp: 4.2, originCoords: [19.0760, 72.8777], destCoords: [28.5672, 77.2100] },
    { id: "SHP-8834", drug: "Heparin 5000 IU", origin: "Delhi Central", dest: "J.J. Hospital Mumbai", status: 1, expected: "Tomorrow, 10:00 AM", vendor: "Global Meds", temp: 3.5, originCoords: [28.7041, 77.1025], destCoords: [18.9622, 72.8336] },
    { id: "SHP-7712", drug: "Insulin Glargine", origin: "Hyderabad Hub", dest: "Safdarjung Hospital", status: 3, expected: "Arrived", vendor: "MediSupply", temp: 5.1, originCoords: [17.3850, 78.4867], destCoords: [28.5682, 77.2045] },
    { id: "SHP-6543", drug: "Paracetamol 500mg", origin: "Bangalore Depot", dest: "District Hospital Nashik", status: 0, expected: "Aug 20, 2:00 PM", vendor: "HealthCorp", temp: 24.0, originCoords: [12.9716, 77.5946], destCoords: [20.0031, 73.7915] },
    { id: "SHP-5432", drug: "IV Saline 500ml", origin: "Mumbai Hub", dest: "Rajiv Gandhi Super Speciality", status: 2, expected: "Today, 11:30 PM", vendor: "Acme Pharma", temp: 22.5, originCoords: [19.0760, 72.8777], destCoords: [28.7041, 77.1025] },
    { id: "SHP-4321", drug: "ORS Sachets", origin: "Delhi Central", dest: "State Civil Hospital", status: 1, expected: "Aug 21, 9:00 AM", vendor: "Global Meds", temp: 25.1, originCoords: [28.7041, 77.1025], destCoords: [22.5726, 88.3639] },
    { id: "SHP-3210", drug: "Cough Syrup", origin: "Bangalore Depot", dest: "City General Hospital", status: 2, expected: "Today, 6:00 PM", vendor: "HealthCorp", temp: 20.0, originCoords: [12.9716, 77.5946], destCoords: [13.0827, 80.2707] },
    { id: "SHP-2109", drug: "Amoxicillin 250mg", origin: "Hyderabad Hub", dest: "Rural PHC Karjat", status: 3, expected: "Arrived", vendor: "MediSupply", temp: 23.4, originCoords: [17.3850, 78.4867], destCoords: [18.9131, 73.3283] },
    { id: "SHP-1098", drug: "Insulin Injection", origin: "Mumbai Hub", dest: "District Hospital Nashik", status: 1, expected: "Tomorrow, 4:00 PM", vendor: "Acme Pharma", temp: 4.8, originCoords: [19.0760, 72.8777], destCoords: [20.0031, 73.7915] },
    { id: "SHP-0987", drug: "IV Saline 500ml", origin: "Delhi Central", dest: "AIIMS New Delhi", status: 0, expected: "Aug 22, 10:00 AM", vendor: "Global Meds", temp: 21.0, originCoords: [28.7041, 77.1025], destCoords: [28.5672, 77.2100] },
];

export default function TrackShipmentPage() {
    const { role } = useRole();
    const [shipments, setShipments] = useState(initialShipments);
    const [selectedShipmentId, setSelectedShipmentId] = useState<string>("all");
    const [liveTemp, setLiveTemp] = useState(4.2);

    // Simulate IoT Temperature variations for the currently selected shipment
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveTemp(prev => {
                const diff = (Math.random() - 0.5) * 0.4;
                let newTemp = prev + diff;
                if (newTemp > 7.5) newTemp -= 0.5;
                if (newTemp < 2.0) newTemp += 0.5;
                return Number(newTemp.toFixed(1));
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = (id: string) => {
        setShipments(prev => prev.map(ship => {
            if (ship.id === id && ship.status < 3) {
                return { ...ship, status: ship.status + 1 };
            }
            return ship;
        }));
    };

    const current = shipments.find(s => s.id === selectedShipmentId);
    
    // For specific shipments requiring cold chain (like Insulin), use liveTemp, otherwise use static temp
    const displayTemp = current?.drug.toLowerCase().includes("insulin") || current?.drug.toLowerCase().includes("heparin") 
        ? liveTemp 
        : current?.temp || 20;

    const isWarningTemp = displayTemp > 8.0 || displayTemp < 2.0;

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Left Panel: Vertical Shipment List */}
            <div className="w-80 border-r border-slate-100 bg-slate-50 flex flex-col shrink-0">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
                    <h2 className="font-bold text-slate-900">Active Shipments</h2>
                    {role === "vendor_pharma" && (
                        <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                </div>
                
                <div className="p-3 border-b border-slate-200">
                    <button
                        onClick={() => setSelectedShipmentId("all")}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-colors ${
                            selectedShipmentId === "all" 
                            ? 'bg-slate-900 text-white shadow-sm' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <List className="w-4 h-4" /> View All Shipments
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {shipments.map(ship => (
                        <button
                            key={ship.id}
                            onClick={() => setSelectedShipmentId(ship.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                                selectedShipmentId === ship.id 
                                ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/20' 
                                : 'bg-transparent border-transparent hover:bg-slate-100'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-mono font-semibold text-slate-500">{ship.id}</span>
                                <span className={`w-2 h-2 rounded-full ${ship.status === 3 ? 'bg-green-500' : ship.status === 2 ? 'bg-blue-500' : 'bg-orange-500'}`} />
                            </div>
                            <p className="font-bold text-slate-900 truncate">{ship.drug}</p>
                            <p className="text-xs text-slate-500 mt-1 truncate">To: {ship.dest}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Panel: Content Area */}
            <div className="flex-1 flex flex-col bg-slate-50/30 overflow-y-auto p-8 relative">
                
                {selectedShipmentId === "all" ? (
                    // VIEW ALL MODE
                    <div className="animate-in fade-in duration-300">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shipment Master List</h1>
                            <p className="text-slate-500 font-medium mt-1">Overview of all active and completed deliveries.</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left text-sm text-slate-700">
                                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">SHIPMENT ID</th>
                                        <th className="px-6 py-4">DRUG</th>
                                        <th className="px-6 py-4">VENDOR</th>
                                        <th className="px-6 py-4">DESTINATION</th>
                                        <th className="px-6 py-4">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {shipments.map(ship => (
                                        <tr key={ship.id} className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => setSelectedShipmentId(ship.id)}>
                                            <td className="px-6 py-4 font-mono font-semibold text-slate-900">{ship.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{ship.drug}</td>
                                            <td className="px-6 py-4 text-slate-600">{ship.vendor}</td>
                                            <td className="px-6 py-4 font-medium text-slate-600">{ship.dest}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    ship.status === 3 ? 'bg-green-100 text-green-700' :
                                                    ship.status === 2 ? 'bg-blue-100 text-blue-700' :
                                                    ship.status === 1 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {["Placed", "Dispatched", "In Transit", "Delivered"][ship.status]}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : current && (
                    // DETAIL MODE
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 pb-6 border-b border-slate-100">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl border border-blue-100">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{current.id}</h1>
                                </div>
                                <p className="text-slate-500 font-medium">{current.drug} delivery by <span className="font-bold">{current.vendor}</span> to {current.dest}</p>
                            </div>

                            <div className="flex gap-4">
                                <div className={`flex items-center gap-4 px-5 py-3 rounded-2xl border ${isWarningTemp ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-blue-700'}`}>
                                    <Thermometer className="w-6 h-6" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-0.5">IoT Temp Sensor</p>
                                        <p className="text-2xl font-black font-mono tracking-tighter">{displayTemp}°C</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isWarningTemp && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Temperature Excursion Warning</p>
                                    <p className="text-sm mt-1 opacity-90">The IoT sensor has reported a temperature outside of the safe 2°C - 8°C range. Please investigate immediately.</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            
                            {/* Stepper UI */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Delivery Status</h3>
                                <div className="relative">
                                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
                                    
                                    {["Order Placed", "Dispatched", "In Transit", "Delivered"].map((step, idx) => (
                                        <div key={idx} className="relative flex items-center gap-6 mb-8 last:mb-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-sm ${
                                                idx < current.status ? 'bg-emerald-500 text-white' : 
                                                idx === current.status ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
                                                'bg-slate-100 text-slate-400'
                                            }`}>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`font-bold ${idx <= current.status ? 'text-slate-900' : 'text-slate-400'}`}>{step}</p>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">
                                                    {idx < current.status ? "Completed" : idx === current.status ? "Current Status" : "Pending"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {role === "vendor_pharma" && current.status < 3 && (
                                    <button 
                                        onClick={() => handleUpdateStatus(current.id)}
                                        className="mt-8 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        Update Status to {["Dispatched", "In Transit", "Delivered", ""][current.status]} <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Route Details & Map */}
                            <div className="space-y-6">
                                
                                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Route Info</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><MapPin className="w-3 h-3"/> Origin</p>
                                            <p className="text-sm font-bold text-slate-900">{current.origin}</p>
                                        </div>
                                        <div className="w-full h-px bg-slate-100" />
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><MapPin className="w-3 h-3"/> Destination</p>
                                            <p className="text-sm font-bold text-slate-900">{current.dest}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Interactive Map */}
                                <div className="bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden h-64 relative shadow-sm z-0">
                                    <MapRoute origin={current.originCoords as [number, number]} dest={current.destCoords as [number, number]} />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm border border-slate-200 text-slate-600 flex items-center gap-1 z-10">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                        Active Route
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
