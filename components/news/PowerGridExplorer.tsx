'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Activity, Cable, TrendingUp, FileText, BarChart3, Download, 
  RefreshCw, MapPin 
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, LineChart, Line, CartesianGrid 
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0ea5e9', '#14b8a6'];

const defaultMix = [
  { name: 'Gas (CCGT + GT)', value: 52, mw: 14780 },
  { name: 'Coal', value: 18, mw: 5110 },
  { name: 'HFO / Diesel', value: 12, mw: 3410 },
  { name: 'Hydro', value: 2, mw: 570 },
  { name: 'Solar + Wind', value: 5, mw: 1420 },
  { name: 'Imports', value: 8, mw: 2270 },
  { name: 'Nuclear (Rooppur-1)', value: 3, mw: 850 },
];

const defaultLines = [
  { name: '400 kV Patuakhali–Gopalganj', status: 'Commissioned', capacity: '1800 MW', owner: 'PGCB', load: 74 },
  { name: '400 kV Rooppur–Baghabari', status: 'Under Construction', capacity: '2400 MW', owner: 'PGCB', load: 0 },
  { name: '230 kV Barisal–Khulna', status: 'Commissioned', capacity: '650 MW', owner: 'PGCB', load: 82 },
  { name: '400 kV Bheramara HVDC (India)', status: 'Operational', capacity: '1000 MW', owner: 'PGCB/POWERGRID', load: 90 },
];

const demandData = [
  { hour: '00:00', demand: 9200 }, { hour: '06:00', demand: 10800 }, 
  { hour: '09:00', demand: 14200 }, { hour: '12:00', demand: 16500 },
  { hour: '15:00', demand: 15800 }, { hour: '18:00', demand: 17200 }, 
  { hour: '21:00', demand: 14900 }, { hour: '24:00', demand: 10300 },
];

const defaultProjects = [
  { name: 'SREDA 1800 MW Solar+Wind', status: 'Tender', mw: '1800', date: 'Q3 2026' },
  { name: 'Matarbari Phase-2 Coal', status: 'Construction', mw: '1200', date: '2027' },
  { name: 'Payra 1320 MW Expansion', status: 'Planned', mw: '1320', date: '2028' },
  { name: 'BREB 500k SHS + Mini-grid', status: 'Ongoing', mw: '—', date: '2026-27' },
];

interface PowerGridExplorerProps {
  initialMix?: typeof defaultMix;
  initialLines?: typeof defaultLines;
  initialProjects?: typeof defaultProjects;
}

export function PowerGridExplorer({ initialMix, initialLines, initialProjects }: PowerGridExplorerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'mix' | 'grid' | 'demand' | 'projects'>('overview');
  
  const generationMix = initialMix || defaultMix;
  const transmissionLines = initialLines || defaultLines;
  const projects = initialProjects || defaultProjects;

  // Calculate totals dynamically based on current data
  const totalCapacityMw = generationMix.reduce((sum, item) => sum + item.mw, 0);
  const totalCapacityGw = (totalCapacityMw / 1000).toFixed(1);
  const renewablesMw = generationMix.find(item => item.name.toLowerCase().includes('solar'))?.mw || 1420;
  const renewablesGw = (renewablesMw / 1000).toFixed(2);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'mix', label: 'Generation Mix', icon: Zap },
    { id: 'grid', label: 'Transmission', icon: Cable },
    { id: 'demand', label: 'Demand Trends', icon: Activity },
    { id: 'projects', label: 'Major Projects', icon: FileText },
  ] as const;

  return (
    <div>
      {/* KPI strip - rich cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Installed Capacity', val: `${totalCapacityGw} GW`, icon: Zap },
          { label: 'Today Peak Demand', val: '17.2 GW', icon: Activity },
          { label: 'Renewables Online', val: `${renewablesGw} GW`, icon: Zap },
          { label: 'Transmission (400kV+)', val: '4,850 km', icon: Cable },
          { label: 'Reserve Margin', val: '11.4%', icon: TrendingUp },
        ].map((k, i) => (
          <div key={i} className="stat flex items-center gap-3 relative overflow-hidden pt-5 pb-4 px-4 hover:border-border transition-colors">
            <k.icon className="h-5 w-5 text-primary shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">{k.label}</div>
              <div className="font-semibold tabular-nums text-lg tracking-tight">{k.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium tabs */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {tabs.map(t => {
          const TabIcon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`explorer-tab transition-all duration-200 font-semibold px-4 py-2 text-xs border rounded-xl flex items-center gap-2 ${
                active 
                  ? 'bg-primary/10 text-primary border-primary/30 shadow-sm' 
                  : 'border-border/60 hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <TabIcon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex justify-between mb-4 items-center">
              <div className="font-display font-bold text-base text-foreground">Generation Mix Snapshot</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border/40">Current Feed</div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={generationMix} cx="50%" cy="48%" innerRadius={68} outerRadius={118} labelLine={false} label={({ name, percent }) => `${(name || '').split(' ')[0]} ${((percent || 0) * 100).toFixed(0)}%`}>
                    {generationMix.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-bold text-base text-foreground">Key Transmission Corridors</div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5 select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
              </span>
            </div>
            <div className="space-y-4 text-sm">
              {transmissionLines.slice(0, 3).map((l, i) => {
                const isUnderConstruction = l.status.includes('Construction');
                return (
                  <div key={i} className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-3.5 hover:border-border/80 transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium flex items-center gap-2"><Cable className="h-3.5 w-3.5 text-muted-foreground" /> {l.name}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{l.owner} • {l.capacity}</div>
                      </div>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                        isUnderConstruction 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                    {/* SCADA Telemetry flow meter */}
                    {!isUnderConstruction ? (
                      <div className="mt-1">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                          <span>Real-time Load Factor</span>
                          <span className="font-mono font-bold text-foreground">{l.load}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden relative">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              l.load > 85 
                                ? 'bg-rose-500' 
                                : l.load > 70 
                                  ? 'bg-amber-500' 
                                  : 'bg-emerald-500'
                            }`}
                            style={{ width: `${l.load}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Expected Commissioning</span>
                        <span className="font-semibold text-foreground/80">Q4 2026</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Link href="#grid" onClick={() => setActiveTab('grid')} className="text-xs text-primary hover:underline mt-4 inline-block font-semibold transition-colors">
              View full transmission status →
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'mix' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-display font-bold text-base text-foreground">Installed Capacity by Fuel — June 2026</div>
              <div className="text-xs text-muted-foreground mt-0.5">Source: BPDB Generation Report</div>
            </div>
            <div className="text-xs px-3.5 py-1 bg-muted border border-border/40 rounded-full font-bold uppercase tracking-wider text-muted-foreground">Total {totalCapacityGw} GW</div>
          </div>
          <div className="h-80 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generationMix}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mw" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 text-sm">
            {generationMix.map((g, idx) => (
              <div key={idx} className="flex justify-between rounded-xl bg-muted/40 border border-border/50 px-3.5 py-2.5 hover:border-border transition-colors duration-150">
                <span className="font-medium">{g.name}</span>
                <span className="tabular-nums font-bold text-foreground/90">{g.mw.toLocaleString()} MW</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'grid' && (
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5 border-b border-border/40 pb-4">
            <Cable className="h-5 w-5 text-primary" />
            <div className="font-display font-bold text-lg text-foreground">Major Transmission Lines &amp; Interconnectors</div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b border-border/80">
                <tr>
                  <th className="py-2.5 pr-4 font-semibold text-xs uppercase tracking-wider">Line / Corridor</th>
                  <th className="py-2.5 pr-4 font-semibold text-xs uppercase tracking-wider">Capacity</th>
                  <th className="py-2.5 pr-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="py-2.5 pr-4 font-semibold text-xs uppercase tracking-wider">Operator</th>
                  <th className="py-2.5 font-semibold text-xs uppercase tracking-wider">Current Load</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {transmissionLines.map((l, idx) => {
                  const isUnderConstruction = l.status.includes('Construction');
                  return (
                    <tr key={idx} className="transition-colors hover:bg-muted/20">
                      <td className="py-3.5 pr-4 font-medium flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {l.name}
                      </td>
                      <td className="py-3.5 pr-4 tabular-nums text-foreground/90 font-bold">{l.capacity}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                          isUnderConstruction 
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-muted-foreground font-semibold">{l.owner}</td>
                      <td className="py-3.5">
                        {!isUnderConstruction ? (
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-foreground text-xs">{l.load}%</span>
                            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden relative hidden sm:block">
                              <div 
                                className={`h-full rounded-full ${
                                  l.load > 85 ? 'bg-rose-500' : l.load > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${l.load}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-xs mt-5 text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Data refreshed from PGCB SCADA. Full GIS map available to members.
          </div>
        </div>
      )}

      {activeTab === 'demand' && (
        <div className="card p-6">
          <div className="font-display font-bold text-base mb-4 flex items-center gap-2 text-foreground">
            <Activity className="h-4 w-4 text-primary" /> Hourly Demand Profile — 14 Jun 2026 (Live SCADA Grid Feed)
          </div>
          <div className="h-80 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.5} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="natural" dataKey="demand" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Evening peak demand typically occurs between 18:30–21:00 during summer months.
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-base text-foreground">Major Generation &amp; Grid Projects (2026–2028)</div>
            <Link href="/admin/articles" className="text-xs text-primary hover:underline font-semibold">See tender coverage →</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((p, idx) => (
              <div key={idx} className="card p-5 flex flex-col justify-between hover:border-border transition-colors duration-150">
                <div>
                  <div className="font-display font-bold text-base text-foreground">{p.name}</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {p.mw !== '—' && <span className="tabular-nums font-semibold text-foreground/90">{p.mw} MW • </span>}
                    Target commissioning: <span className="font-semibold text-foreground/80">{p.date}</span>
                  </div>
                </div>
                <div>
                  <span className={`inline-block mt-4 text-[10px] uppercase tracking-wider font-bold rounded-full border px-2.5 py-0.5 ${
                    p.status === 'Tender' 
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
                      : p.status === 'Construction' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-muted text-muted-foreground border-border/50'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/articles" className="text-sm text-primary hover:underline font-semibold transition-colors">
              Read full project pipeline analysis and tender notices →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
