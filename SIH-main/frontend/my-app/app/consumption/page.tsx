"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";
import { Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Mock Data since we don't have a specific API endpoint for this yet
const monthlyData = [
    { month: "Jan", consumption: 4000, expected: 3800 },
    { month: "Feb", consumption: 3000, expected: 3200 },
    { month: "Mar", consumption: 2000, expected: 2500 },
    { month: "Apr", consumption: 2780, expected: 2800 },
    { month: "May", consumption: 1890, expected: 1900 },
    { month: "Jun", consumption: 2390, expected: 2100 },
    { month: "Jul", consumption: 3490, expected: 3100 },
];

const institutionData = [
    { name: "Central", value: 14000 },
    { name: "Nashik Hosp", value: 8500 },
    { name: "City Gen", value: 6200 },
    { name: "Rural PHC", value: 3100 },
];

export default function ConsumptionPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Consumption Analytics</h1>
                    <p className="text-sm text-zinc-400 mt-1">Monitor usage patterns and predict future demand</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20">
                        <ArrowDownRight className="w-4 h-4" /> 12% vs last month
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Consumption Trends</h2>
                        <select className="bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 rounded px-2 py-1 outline-none">
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#71717a' }} stroke="#27272a" />
                                <YAxis tick={{ fontSize: 12, fill: '#71717a' }} stroke="#27272a" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="consumption" name="Actual Consumption" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorConsumption)" />
                                <Area type="monotone" dataKey="expected" name="Expected / Baseline" stroke="#71717a" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Institution Breakdown */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">By Institution</h2>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={institutionData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#fff' }} width={80} />
                                <Tooltip 
                                    cursor={{fill: '#27272a'}}
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" /> Key Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                            <p className="text-sm font-medium text-zinc-400">Highest Consuming Region</p>
                            <p className="text-lg font-bold text-white mt-1">Nashik Hospital</p>
                            <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +5% vs baseline</p>
                        </div>
                        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                            <p className="text-sm font-medium text-zinc-400">Fastest Depleting Drug</p>
                            <p className="text-lg font-bold text-white mt-1">Amoxicillin 500mg</p>
                            <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> Reorder recommended</p>
                        </div>
                        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                            <p className="text-sm font-medium text-zinc-400">Overall Efficiency</p>
                            <p className="text-lg font-bold text-white mt-1">Optimal</p>
                            <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><ArrowDownRight className="w-3 h-3"/> Wastage reduced by 2%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
