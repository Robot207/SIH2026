"use client";

import { useState } from "react";
import { PlusSquare, Save, Info } from "lucide-react";
import { useRole } from "../context/RoleContext";

export default function AddStockPage() {
    const { role } = useRole();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        type: "received",
        institution: "Central Warehouse",
        drug: "",
        category: "Antibiotics",
        quantity: "",
        unit: "Box",
        batch_id: "",
        expiry: "",
        notes: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setSuccess("Stock entry recorded successfully.");
        setForm({ ...form, drug: "", quantity: "", batch_id: "", expiry: "", notes: "" });
        setLoading(false);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <PlusSquare className="w-6 h-6 text-blue-400" /> Stock Entry Form
                </h1>
                <p className="text-sm text-zinc-400 mt-1">Record new inventory receipts or consumption adjustments.</p>
            </div>

            {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <Save className="w-4 h-4" /> {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Entry Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                                    <input type="radio" name="type" value="received" checked={form.type === "received"} onChange={handleChange} className="accent-blue-500" />
                                    Stock Received (Inbound)
                                </label>
                                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                                    <input type="radio" name="type" value="consumed" checked={form.type === "consumed"} onChange={handleChange} className="accent-blue-500" />
                                    Stock Consumed (Outbound)
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Institution / Location</label>
                            <select name="institution" value={form.institution} onChange={handleChange} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700">
                                <option>Central Warehouse</option>
                                <option>Nashik Hospital</option>
                                <option>City General</option>
                                <option>Rural PHC</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Drug Name</label>
                            <input required name="drug" value={form.drug} onChange={handleChange} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700" placeholder="e.g. Paracetamol 500mg" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Category</label>
                            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700">
                                <option>Antibiotics</option>
                                <option>Painkillers</option>
                                <option>Vaccines</option>
                                <option>Cardiovascular</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Quantity</label>
                            <input required type="number" name="quantity" value={form.quantity} onChange={handleChange} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Unit</label>
                            <select name="unit" value={form.unit} onChange={handleChange} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700">
                                <option>Box</option>
                                <option>Vial</option>
                                <option>Strip</option>
                                <option>Bottle</option>
                                <option>Piece</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Batch ID</label>
                            <input required name="batch_id" value={form.batch_id} onChange={handleChange} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700" placeholder="BTH-XXXX" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Expiry Date</label>
                            <input required type="date" name="expiry" value={form.expiry} onChange={handleChange} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Notes (Optional)</label>
                            <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700 resize-none h-[42px]" placeholder="Any specific condition..."></textarea>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-800 bg-zinc-900 flex justify-between items-center">
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <Info className="w-4 h-4" /> All entries are logged with your User ID for audit trails.
                    </div>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2">
                        {loading ? "Saving..." : <><Save className="w-4 h-4" /> Submit Entry</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
