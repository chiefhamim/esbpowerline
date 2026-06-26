'use client';

import { useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  Node as FlowNode,
  Edge as FlowEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Building, Factory, Activity, Sun, Globe, Cable, Cpu, Info, Droplet, Zap, HelpCircle, ExternalLink
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

// Icon Map for clean visual identifiers
const ICON_MAP: Record<string, any> = {
  building: Building,
  factory: Factory,
  network: Activity,
  sun: Sun,
  globe: Globe,
  cable: Cable,
  cpu: Cpu,
  droplet: Droplet,
  zap: Zap,
};

// Simplified Custom Node Renderer
function CustomGridNode({ data }: { data: any }) {
  const Icon = ICON_MAP[data.icon] || HelpCircle;
  const isSelected = data.selected;
  
  return (
    <div 
      className={cn(
        "px-3.5 py-3 rounded-lg border bg-slate-900 border-slate-800 text-slate-100 shadow-md flex items-center gap-3 min-w-[200px] select-none transition-all duration-200",
        isSelected ? "ring-2 ring-primary border-primary shadow-lg scale-[1.02]" : "hover:border-slate-700"
      )}
      style={{
        borderLeft: `4px solid ${data.nodeColor || '#64748b'}`
      }}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-700 !border-slate-800" />
      
      {/* Quiet Status Dot */}
      <span className="absolute top-2 right-2 flex h-1.5 w-1.5 rounded-full bg-emerald-500" />

      {/* Clean Icon Wrapper */}
      <div 
        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ 
          backgroundColor: `${data.nodeColor || '#64748b'}15`,
          color: data.nodeColor || '#cbd5e1'
        }}
      >
        <Icon className="h-4 w-4" />
      </div>
      
      {/* Node Labels & KPI */}
      <div className="min-w-0 flex-1">
        <div className="text-[8px] text-slate-400 uppercase font-mono tracking-wider font-bold leading-none">
          {data.designation}
        </div>
        <div className="font-bold text-[11px] text-slate-200 truncate mt-0.5 leading-tight tracking-tight">
          {data.label}
        </div>
        {data.kpiValue !== undefined && (
          <div className="text-[10px] font-mono font-medium text-slate-400 mt-1 leading-none">
            {data.kpiValue}{' '}{data.kpiUnit}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-slate-700 !border-slate-800" />
    </div>
  );
}

const nodeTypes = {
  gridNode: CustomGridNode,
};

interface GridTopologyMapProps {
  dbNodes?: any[];
  dbEdges?: any[];
  activeData?: any;
}

export function GridTopologyMap({ dbNodes = [], dbEdges = [], activeData }: GridTopologyMapProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Unpack date-specific daily telemetry
  const {
    systemStats,
    generationData,
    gasProductionData,
    borderImportsData,
    regionalDemandData,
  } = activeData || {};

  // 1. Compute dynamic metrics based on activeData date
  const reactiveMetrics = useMemo(() => {
    const totalGas = gasProductionData?.reduce((sum: number, item: any) => sum + (parseFloat(item.gas) || 0), 0) || 2647;
    const bibiyana = gasProductionData?.find((item: any) => item.company?.toLowerCase().includes('bibiyana') || item.company?.toLowerCase().includes('chevron'))?.gas || 928.7;
    const rpgclLng = gasProductionData?.find((item: any) => item.company?.toLowerCase().includes('rpgcl') || item.company?.toLowerCase().includes('lng'))?.gas || 1008;

    const demandPeak = systemStats?.eveningPeakDemand || 16854.11;
    const loadShedVal = systemStats?.totalEnergyUnserved || 7.26;
    const avgCostVal = systemStats?.avgProductionCost || 6.615;
    const dailyCostVal = systemStats?.totalDailyCost ? (systemStats.totalDailyCost / 10000000).toFixed(1) : '227.1';

    const cbImports = borderImportsData?.reduce((sum: number, item: any) => sum + (parseFloat(item.importMw) || 0), 0) || 2584;
    
    const renewGen = generationData?.filter((item: any) => ['solar', 'wind', 'hydro'].includes(item.name?.toLowerCase()))
                                    ?.reduce((sum: number, item: any) => sum + (parseFloat(item.gen) || 0), 0) || 5.45;

    // Dhaka local demand split
    const dhakaData = regionalDemandData?.find((item: any) => item.region?.toLowerCase().includes('dhaka'));
    const descoDemand = dhakaData ? (parseFloat(dhakaData.demand) * 0.45) : 3180;
    const dpdcDemand = dhakaData ? (parseFloat(dhakaData.demand) * 0.55) : 3850;

    const ruralDemand = regionalDemandData?.filter((item: any) => !['dhaka', 'chittagong'].includes(item.region?.toLowerCase()))
                                          ?.reduce((sum: number, item: any) => sum + (parseFloat(item.demand) || 0), 0) || 5800;

    const westDemand = regionalDemandData?.filter((item: any) => ['khulna', 'barishal'].includes(item.region?.toLowerCase()))
                                        ?.reduce((sum: number, item: any) => sum + (parseFloat(item.demand) || 0), 0) || 850;

    const nwDemand = regionalDemandData?.filter((item: any) => ['rajshahi', 'rangpur'].includes(item.region?.toLowerCase()))
                                      ?.reduce((sum: number, item: any) => sum + (parseFloat(item.demand) || 0), 0) || 1100;

    return {
      totalGas,
      bibiyana,
      rpgclLng,
      demandPeak,
      loadShedVal,
      avgCostVal,
      dailyCostVal,
      cbImports,
      renewGen,
      descoDemand,
      dpdcDemand,
      ruralDemand,
      westDemand,
      nwDemand
    };
  }, [systemStats, generationData, gasProductionData, borderImportsData, regionalDemandData]);

  // 2. Positional setup of default nodes
  const defaultNodes = useMemo(() => [
    {
      id: 'mpemr',
      label: 'Ministry of Power & Energy (MPEMR)',
      designation: 'Policy & Budget',
      category: 'government',
      icon: 'building',
      nodeColor: '#6366f1',
      kpiValue: reactiveMetrics.dailyCostVal,
      kpiUnit: 'Cr Tk Daily',
      description: 'Apex policy-formulating ministry setting gas import levels, subsidies, generation targets, and bulk/retail pricing frameworks.',
      websiteUrl: 'https://mpemr.gov.bd',
      x: 300,
      y: 35,
    },
    {
      id: 'berc',
      label: 'Energy Regulator (BERC)',
      designation: 'Regulatory Body',
      category: 'regulator',
      icon: 'cpu',
      nodeColor: '#10b981',
      kpiValue: '8.39',
      kpiUnit: 'Tk/kWh Retail',
      description: 'Statutory commission regulating power grid operations, bulk & consumer tariffs, distribution licensing, and grid codes.',
      websiteUrl: 'https://berc.gov.bd',
      x: 600,
      y: 35,
    },
    {
      id: 'petrobangla',
      label: 'Petrobangla',
      designation: 'Gas Authority',
      category: 'gas',
      icon: 'droplet',
      nodeColor: '#06b6d4',
      kpiValue: String(Math.round(reactiveMetrics.totalGas)),
      kpiUnit: 'MMCFD Produced',
      description: 'State corporation managing upstream contracts, local field production, LNG purchases, and gas allocation to generator plants.',
      websiteUrl: 'https://www.petrobangla.org.bd',
      x: 100,
      y: 130,
    },
    {
      id: 'bibiyana',
      label: 'Bibiyana field (Chevron)',
      designation: 'Gas Production',
      category: 'gas',
      icon: 'droplet',
      nodeColor: '#0891b2',
      kpiValue: String(reactiveMetrics.bibiyana),
      kpiUnit: 'MMCFD Output',
      description: 'Largest domestic gas source, supplying over 35% of national gas intake. Heavily prioritizes feeding the gas-fired power generator pool.',
      websiteUrl: '#',
      x: 100,
      y: 230,
    },
    {
      id: 'rpgcl',
      label: 'RPGCL (LNG Regas)',
      designation: 'LNG Terminals',
      category: 'gas',
      icon: 'globe',
      nodeColor: '#0284c7',
      kpiValue: String(Math.round(reactiveMetrics.rpgclLng)),
      kpiUnit: 'MMCFD Regas',
      description: 'Rupantarita Prakritik Gas Company Limited regasifies imported LNG from terminals off Moheshkhali into the main pipeline.',
      websiteUrl: 'https://rpgcl.org.bd',
      x: 280,
      y: 230,
    },
    {
      id: 'bpdb',
      label: 'BPDB (Single Buyer)',
      designation: 'Offtaker & Buyer',
      category: 'state_generation',
      icon: 'factory',
      nodeColor: '#0d9488',
      kpiValue: String(Math.round(reactiveMetrics.demandPeak)),
      kpiUnit: 'MW Peak Demand',
      description: 'Single-buyer state board that procures bulk capacity from state plants, IPPs, cross-border imports, and clean energy generators.',
      websiteUrl: 'https://bpdb.gov.bd',
      x: 450,
      y: 130,
    },
    {
      id: 'india_imports',
      label: 'India Interconnectors',
      designation: 'CB Imports',
      category: 'imports',
      icon: 'globe',
      nodeColor: '#a855f7',
      kpiValue: String(Math.round(reactiveMetrics.cbImports)),
      kpiUnit: 'MW Import flow',
      description: 'Cross-border links importing base-load power from India (Adani dedicated line, HVDC Bheramara, and Tripura links).',
      websiteUrl: '#',
      x: 740,
      y: 130,
    },
    {
      id: 'sreda',
      label: 'SREDA',
      designation: 'Renewables Agency',
      category: 'regulator',
      icon: 'sun',
      nodeColor: '#84cc16',
      kpiValue: String(reactiveMetrics.renewGen),
      kpiUnit: 'MKWh Daily Gen',
      description: 'Sustainable and Renewable Energy Development Authority, facilitating clean energy capacity integration (solar, wind, hydro).',
      websiteUrl: 'https://sreda.gov.bd',
      x: 920,
      y: 130,
    },
    {
      id: 'pgcb',
      label: 'National Grid (PGCB)',
      designation: 'Transmission Loop',
      category: 'transmission',
      icon: 'activity',
      nodeColor: '#3b82f6',
      kpiValue: String(reactiveMetrics.loadShedVal),
      kpiUnit: 'MKWh Deficit',
      description: 'High-voltage transmission loop operator. Manages substations and coordinates national load dispatch matching supply and demand.',
      websiteUrl: 'https://pgcb.gov.bd',
      x: 450,
      y: 260,
    },
    {
      id: 'desco',
      label: 'DESCO (Dhaka North)',
      designation: 'Distributor',
      category: 'distribution',
      icon: 'cable',
      nodeColor: '#f97316',
      kpiValue: String(Math.round(reactiveMetrics.descoDemand)),
      kpiUnit: 'MW Load',
      description: 'Retailer delivering power to northern Dhaka (Gulshan, Uttara, Mirpur). Operates automated telemetry grids.',
      websiteUrl: 'https://desco.gov.bd',
      x: 100,
      y: 390,
    },
    {
      id: 'dpdc',
      label: 'DPDC (Dhaka South)',
      designation: 'Distributor',
      category: 'distribution',
      icon: 'cable',
      nodeColor: '#f97316',
      kpiValue: String(Math.round(reactiveMetrics.dpdcDemand)),
      kpiUnit: 'MW Load',
      description: 'Retail utility serving central & southern Dhaka and Narayanganj industrial zones.',
      websiteUrl: 'https://dpdc.org.bd',
      x: 260,
      y: 390,
    },
    {
      id: 'breb',
      label: 'BREB (Rural Grid)',
      designation: 'Distributor',
      category: 'distribution',
      icon: 'cable',
      nodeColor: '#ea580c',
      kpiValue: String(Math.round(reactiveMetrics.ruralDemand)),
      kpiUnit: 'MW Load',
      description: 'Rural cooperative system serving consumer demands and agricultural irrigation pumping grids.',
      websiteUrl: 'http://www.reb.gov.bd',
      x: 420,
      y: 390,
    },
    {
      id: 'wzpdco',
      label: 'WZPDCO (West Zone)',
      designation: 'Distributor',
      category: 'distribution',
      icon: 'cable',
      nodeColor: '#ea580c',
      kpiValue: String(Math.round(reactiveMetrics.westDemand)),
      kpiUnit: 'MW Load',
      description: 'Utility delivering power to cities and industrial grids in Khulna, Barishal, and Faridpur.',
      websiteUrl: 'https://wzpdco.org.bd',
      x: 580,
      y: 390,
    },
    {
      id: 'nesco',
      label: 'NESCO (North-West)',
      designation: 'Distributor',
      category: 'distribution',
      icon: 'cable',
      nodeColor: '#ea580c',
      kpiValue: String(Math.round(reactiveMetrics.nwDemand)),
      kpiUnit: 'MW Load',
      description: 'Retail operator feeding municipal grids and industrial mills in Rajshahi and Rangpur.',
      websiteUrl: 'https://nesco.gov.bd',
      x: 740,
      y: 390,
    }
  ], [reactiveMetrics]);

  // 3. Simple static edges
  const defaultEdges = useMemo(() => [
    { id: 'e-mpemr-berc', source: 'mpemr', target: 'berc', label: 'Policy code', type: 'smoothstep', animated: false, edgeColor: '#6366f1' },
    { id: 'e-mpemr-bpdb', source: 'mpemr', target: 'bpdb', label: 'Offtake mandate', type: 'smoothstep', animated: false, edgeColor: '#6366f1' },
    { id: 'e-mpemr-petro', source: 'mpemr', target: 'petrobangla', label: 'Fuel budget', type: 'smoothstep', animated: false, edgeColor: '#6366f1' },
    { id: 'e-berc-bpdb', source: 'berc', target: 'bpdb', label: 'Tariff orders', type: 'smoothstep', animated: false, edgeColor: '#10b981' },
    { id: 'e-petro-rpgcl', source: 'petrobangla', target: 'rpgcl', label: 'LNG Imports', type: 'smoothstep', animated: true, edgeColor: '#06b6d4' },
    { id: 'e-petro-bibi', source: 'petrobangla', target: 'bibiyana', label: 'PSC Allocations', type: 'smoothstep', animated: false, edgeColor: '#06b6d4' },
    { id: 'e-rpgcl-bpdb', source: 'rpgcl', target: 'bpdb', label: 'Regas gas flow', type: 'smoothstep', animated: true, edgeColor: '#0284c7' },
    { id: 'e-bibi-bpdb', source: 'bibiyana', target: 'bpdb', label: 'Field gas flow', type: 'smoothstep', animated: true, edgeColor: '#0891b2' },
    { id: 'e-india-bpdb', source: 'india_imports', target: 'bpdb', label: 'PPA Import', type: 'smoothstep', animated: true, edgeColor: '#a855f7' },
    { id: 'e-sreda-bpdb', source: 'sreda', target: 'bpdb', label: 'Clean PPA', type: 'smoothstep', animated: false, edgeColor: '#84cc16' },
    { id: 'e-bpdb-pgcb', source: 'bpdb', target: 'pgcb', label: 'Evacuate gen', type: 'smoothstep', animated: true, edgeColor: '#0d9488' },
    { id: 'e-pgcb-desco', source: 'pgcb', target: 'desco', label: 'Feed line', type: 'smoothstep', animated: true, edgeColor: '#3b82f6' },
    { id: 'e-pgcb-dpdc', source: 'pgcb', target: 'dpdc', label: 'Feed line', type: 'smoothstep', animated: true, edgeColor: '#3b82f6' },
    { id: 'e-pgcb-breb', source: 'pgcb', target: 'breb', label: 'Feed line', type: 'smoothstep', animated: true, edgeColor: '#3b82f6' },
    { id: 'e-pgcb-wzpd', source: 'pgcb', target: 'wzpdco', label: 'Feed line', type: 'smoothstep', animated: true, edgeColor: '#3b82f6' },
    { id: 'e-pgcb-nesc', source: 'pgcb', target: 'nesco', label: 'Feed line', type: 'smoothstep', animated: true, edgeColor: '#3b82f6' },
  ], []);

  // 4. Merge overrides with static nodes/edges
  const nodes = useMemo(() => {
    return defaultNodes.map((defNode) => {
      const dbNode = dbNodes.find((n) => n.id === defNode.id || n.label.toLowerCase().includes(defNode.id.toLowerCase()));
      
      const kpiValue = dbNode?.kpiValue || defNode.kpiValue;
      const kpiUnit = dbNode?.kpiUnit || defNode.kpiUnit;
      const designation = dbNode?.designation || defNode.designation;
      const label = dbNode?.label || defNode.label;
      const nodeColor = dbNode?.nodeColor || defNode.nodeColor;

      const flowNode: FlowNode = {
        id: defNode.id,
        type: 'gridNode',
        position: { x: defNode.x, y: defNode.y },
        data: {
          label,
          designation,
          category: defNode.category,
          icon: defNode.icon,
          nodeColor,
          kpiValue,
          kpiUnit,
          description: defNode.description,
          websiteUrl: defNode.websiteUrl,
          selected: selectedNodeId === defNode.id,
        },
      };
      return flowNode;
    });
  }, [defaultNodes, dbNodes, selectedNodeId]);

  const edges = useMemo(() => {
    return defaultEdges.map((defEdge) => {
      const dbEdge = dbEdges.find(e => e.id === defEdge.id || (e.source === defEdge.source && e.target === defEdge.target));
      const edgeColor = dbEdge?.color || defEdge.edgeColor;
      const isAnimated = dbEdge?.animated !== undefined ? dbEdge.animated : defEdge.animated;

      const flowEdge: FlowEdge = {
        id: defEdge.id,
        source: defEdge.source,
        target: defEdge.target,
        animated: isAnimated,
        label: defEdge.label,
        type: defEdge.type,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: edgeColor,
        },
        style: {
          stroke: edgeColor,
          strokeWidth: 1.5,
          opacity: 0.55
        },
        labelStyle: {
          fill: '#64748b',
          fontWeight: 500,
          fontSize: 7,
          fontFamily: 'monospace'
        },
        labelBgStyle: {
          fill: '#0f172a',
          fillOpacity: 0.9,
        },
        labelBgPadding: [3, 1.5],
        labelBgBorderRadius: 3,
      };
      return flowEdge;
    });
  }, [defaultEdges, dbEdges]);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId);
  }, [selectedNodeId, nodes]);

  const nodeColorTheme = selectedNode?.data?.nodeColor || '#64748b';

  return (
    <div className="grid-explorer-chart-card card h-full min-h-[580px] flex flex-col p-0 overflow-hidden relative border border-slate-800 bg-slate-950 rounded-lg shadow-lg">
      <style>{`
        .react-flow__renderer {
          background-color: #0b0f19 !important;
        }
        .react-flow__controls-button {
          background-color: #0f172a !important;
          border-bottom: 1px solid #1e293b !important;
          color: #94a3b8 !important;
        }
        .react-flow__controls-button:hover {
          background-color: #1e293b !important;
          color: #f8fafc !important;
        }
        .react-flow__minimap {
          background-color: rgba(15, 23, 42, 0.85) !important;
          border: 1px solid #1e293b !important;
        }
      `}</style>

      {/* Information Drawer Overlay */}
      <div 
        className={cn(
          "absolute right-3 top-3 bottom-3 w-80 bg-slate-900/95 border border-slate-800 rounded-lg shadow-xl z-50 p-4.5 flex flex-col justify-between backdrop-blur-md transition-all duration-200 transform ease-in-out opacity-0 translate-x-3 pointer-events-none",
          selectedNode && "opacity-100 translate-x-0 pointer-events-auto"
        )}
      >
        {selectedNode && (
          <div className="flex flex-col h-full justify-between text-slate-200 text-xs">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span 
                    className="text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 rounded text-white font-mono"
                    style={{ backgroundColor: nodeColorTheme }}
                  >
                    {selectedNode.data.designation}
                  </span>
                  <h4 className="font-bold text-slate-100 mt-2 text-sm leading-tight tracking-tight">
                    {selectedNode.data.label}
                  </h4>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedNodeId(null)}
                  className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 px-2 py-1 rounded transition-all font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Informative breakdown details */}
              <div className="space-y-3.5 leading-relaxed">
                {selectedNode.data.kpiValue !== undefined && (
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[8.5px] text-slate-400 uppercase font-semibold tracking-wider block">Telemetry Indicator</span>
                    <div 
                      className="text-base font-mono font-bold mt-1 leading-none flex items-baseline gap-1"
                      style={{ color: nodeColorTheme }}
                    >
                      {selectedNode.data.kpiValue}{' '}
                      <span className="text-slate-400 font-sans font-bold text-[10px] uppercase">
                        {selectedNode.data.kpiUnit}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Operational Role</span>
                  <p className="text-[11px] text-slate-300 leading-normal font-sans">
                    {selectedNode.data.description}
                  </p>
                </div>

                {/* BPDB-Specific Generation Fuel Shares - Actually Informative */}
                {selectedNode.id === 'bpdb' && generationData && (
                  <div className="space-y-2 pt-2.5 border-t border-slate-800 text-[10px]">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">Generation Share on this Day</span>
                    <div className="flex flex-col gap-1.5 font-mono text-[9px]">
                      {generationData.filter((item: any) => item.gen > 0).slice(0, 4).map((item: any) => (
                        <div key={item.name} className="flex justify-between">
                          <span className="text-slate-400">{item.name}:</span>
                          <span className="font-semibold text-slate-200">
                            {item.gen.toFixed(1)} MKWh ({((item.gen / reactiveMetrics.demandPeak) * 10).toFixed(0)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Petrobangla Gas Output Shares */}
                {selectedNode.id === 'petrobangla' && gasProductionData && (
                  <div className="space-y-2 pt-2.5 border-t border-slate-800 text-[10px]">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">Gas Production Share</span>
                    <div className="flex flex-col gap-1 text-[9.5px]">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Chevron Bibiyana:</span>
                        <span className="font-semibold text-cyan-400">{reactiveMetrics.bibiyana.toFixed(0)} MMCFD</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">RPGCL LNG Terminal:</span>
                        <span className="font-semibold text-sky-400">{reactiveMetrics.rpgclLng.toFixed(0)} MMCFD</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                        <div className="h-full bg-cyan-500" style={{ width: `${(reactiveMetrics.bibiyana / reactiveMetrics.totalGas) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Transmission Outages */}
                {selectedNode.id === 'pgcb' && systemStats && (
                  <div className="space-y-2 pt-2.5 border-t border-slate-800 text-[10px]">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Total Unserved Energy:</span>
                      <span className="font-bold text-amber-500">{systemStats.totalEnergyUnserved.toFixed(2)} MKWh</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Avg Production Cost:</span>
                      <span className="font-bold text-slate-200">{reactiveMetrics.avgCostVal.toFixed(3)} Tk/kWh</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Close / Action Footer */}
            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 bg-slate-950/20 -mx-4.5 -mb-4.5 px-4.5 py-3 rounded-b-lg">
              {selectedNode.data.websiteUrl && selectedNode.data.websiteUrl !== '#' ? (
                <a
                  href={selectedNode.data.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                >
                  Official Website <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : (
                <span className="text-[9px] text-slate-400 font-mono font-semibold">Source: BPDB/Petrobangla</span>
              )}
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="text-[10px] font-bold text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-800 hover:bg-slate-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ReactFlow Canvas container */}
      <div className="flex-grow w-full h-[580px] relative z-10">
        {/* Simple instructions banner */}
        <div className="absolute left-3 top-3 z-40 bg-slate-900 border border-slate-800 rounded-lg p-2.5 max-w-xs shadow-md select-none pointer-events-none backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[10px] font-bold text-slate-200 leading-tight">National Energy Supply Flow</span>
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">
            Click on any block to trace energy flows. Data reacts dynamically as you select different daily reports.
          </p>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.5}
          maxZoom={1.5}
        >
          <Background color="#334155" style={{ opacity: 0.12 }} gap={16} size={1} />
          <Controls className="bg-slate-900 border border-slate-800 rounded-lg shadow-lg !left-3 !bottom-3 !top-auto !right-auto flex flex-col gap-1 overflow-hidden" />
          <MiniMap 
            nodeColor={(node) => (node.data?.nodeColor as string) || '#64748b'}
            className="!right-3 !bottom-3 border border-slate-800 rounded-lg shadow-lg overflow-hidden bg-slate-950/80 backdrop-blur-md hidden sm:block" 
            style={{ width: 90, height: 70 }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
