'use client';

import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { longitudinalStudyData } from '@/lib/data/macro/longitudinal-study';
import { cn } from '@/lib/utils';
import { Activity, Landmark, Layers, TrendingUp } from 'lucide-react';

export function LongitudinalStudyCharts({ chartTheme }: { chartTheme: any }) {
  const data = longitudinalStudyData;

  const CustomTooltip = ({ active, payload, label, title, unit }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 select-none bg-card">
          <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-3 flex items-center justify-between gap-2">
            <span>{label || 'Data Point'}</span>
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{title}</span>
          </div>
          <div className="space-y-3">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">{entry.name}:</span>
                <span className="font-bold" style={{ color: entry.color }}>
                  {entry.value != null ? Number(entry.value).toFixed(2) : 'N/A'} {unit || ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 mt-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      
      {/* Network Evolution by Voltage */}
      <div className="grid-explorer-chart-card card">
        <div className="grid-explorer-chart-card__head">
          <div className="flex gap-2 items-center">
            <Layers className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="grid-explorer-chart-card__title">Network Evolution by Voltage Level</h3>
              <p className="grid-explorer-chart-card__sub">Growth trajectories of ultra-high vs high voltage transmission corridors</p>
            </div>
          </div>
        </div>
        <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 px-4 pb-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.filter((d: any) => d.Transmission_400kV_ckm)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
              <XAxis dataKey="Fiscal_Year" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip title="Circuit Km" unit="ckm" />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Transmission_400kV_ckm" name="400kV (Ultra-High)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Transmission_230kV_ckm" name="230kV" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Transmission_132kV_ckm" name="132kV" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Grid Buildout */}
      <div className="grid-explorer-chart-card card">
        <div className="grid-explorer-chart-card__head">
          <div className="flex gap-2 items-center">
            <Activity className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="grid-explorer-chart-card__title">Cumulative Grid Build-out</h3>
              <p className="grid-explorer-chart-card__sub">Stacked area showing historical carrying capacity composition</p>
            </div>
          </div>
        </div>
        <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 px-4 pb-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.filter((d: any) => d.Transmission_400kV_ckm)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
              <XAxis dataKey="Fiscal_Year" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip title="Cumulative ckm" unit="ckm" />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="Transmission_132kV_ckm" name="132kV Base Grid" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              <Area type="monotone" dataKey="Transmission_230kV_ckm" name="230kV Main Grid" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Transmission_400kV_ckm" name="400kV Ultra Backbone" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Transmission Added */}
        <div className="grid-explorer-chart-card card">
          <div className="grid-explorer-chart-card__head">
            <div>
              <h3 className="grid-explorer-chart-card__title">Transmission Expansion Pace</h3>
              <p className="grid-explorer-chart-card__sub">New circuit km added per year</p>
            </div>
          </div>
          <div className="grid-explorer-chart-area mt-4 px-4 pb-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                <XAxis dataKey="Fiscal_Year" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip title="Added ckm" unit="ckm" />} cursor={{ fill: chartTheme.gridStroke, opacity: 0.1 }} />
                <Bar dataKey="Transmission_Added_ckm" name="ckm Added" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MVA Added */}
        <div className="grid-explorer-chart-card card">
          <div className="grid-explorer-chart-card__head">
            <div>
              <h3 className="grid-explorer-chart-card__title">Substation Investment Cycles</h3>
              <p className="grid-explorer-chart-card__sub">New MVA capacity added per year</p>
            </div>
          </div>
          <div className="grid-explorer-chart-area mt-4 px-4 pb-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.filter((d: any) => d.MVA_Added != null)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                <XAxis dataKey="Fiscal_Year" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip title="Added MVA" unit="MVA" />} cursor={{ fill: chartTheme.gridStroke, opacity: 0.1 }} />
                <Bar dataKey="MVA_Added" name="MVA Added" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scatter Budget vs Transmission Added */}
        <div className="grid-explorer-chart-card card">
          <div className="grid-explorer-chart-card__head">
            <div>
              <h3 className="grid-explorer-chart-card__title">Budget Elasticity (Transmission)</h3>
              <p className="grid-explorer-chart-card__sub">Correlation between Money Spent vs Lines Built</p>
            </div>
          </div>
          <div className="grid-explorer-chart-area mt-4 px-4 pb-4">
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} />
                <XAxis type="number" dataKey="Power_Division_Budget_TkCr" name="Budget" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} unit="Cr" />
                <YAxis type="number" dataKey="Transmission_Added_ckm" name="Added ckm" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip title="Elasticity" />} />
                <Scatter name="Correlation" data={data.filter((d: any) => d.Transmission_Added_ckm != null)} fill="#0ea5e9" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter Budget vs MVA Added */}
        <div className="grid-explorer-chart-card card">
          <div className="grid-explorer-chart-card__head">
            <div>
              <h3 className="grid-explorer-chart-card__title">Budget Elasticity (MVA)</h3>
              <p className="grid-explorer-chart-card__sub">Correlation between Money Spent vs Substations Built</p>
            </div>
          </div>
          <div className="grid-explorer-chart-area mt-4 px-4 pb-4">
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} />
                <XAxis type="number" dataKey="Power_Division_Budget_TkCr" name="Budget" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} unit="Cr" />
                <YAxis type="number" dataKey="MVA_Added" name="Added MVA" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip title="Elasticity" />} />
                <Scatter name="Correlation" data={data.filter((d: any) => d.MVA_Added != null)} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Indexed Trajectories */}
      <div className="grid-explorer-chart-card card">
        <div className="grid-explorer-chart-card__head">
          <div className="flex gap-2 items-center">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="grid-explorer-chart-card__title">Long-term Trajectories (Indexed)</h3>
              <p className="grid-explorer-chart-card__sub">Base Year FY2011 = 100 for true comparative percentage growth</p>
            </div>
          </div>
        </div>
        <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 px-4 pb-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
              <XAxis dataKey="Fiscal_Year" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip title="Index (Base=100)" />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Budget_Index" name="Budget Growth" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Transmission_Index" name="Transmission Line Growth" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Substation_MVA_Index" name="Substation Capacity Growth" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="3 3" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
