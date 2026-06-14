'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  prefix: string;
}

const initialItems: TickerItem[] = [
  { id: 'lng', name: 'LNG (Spot)', value: 11.85, unit: '/mmbtu', change: 1.4, prefix: '$' },
  { id: 'coal', name: 'Coal (API2)', value: 102.5, unit: '/t', change: -0.8, prefix: '$' },
  { id: 'fx', name: 'USD/BDT', value: 117.65, unit: '', change: 0.12, prefix: '৳' },
  { id: 'solar', name: 'Solar Module', value: 0.118, unit: '/W', change: -2.1, prefix: '$' },
  { id: 'tariff', name: 'Bulk Tariff', value: 8.95, unit: 'Tk/kWh', change: 0.0, prefix: '' },
  { id: 'gas', name: 'Petrobangla Gas', value: 1380, unit: 'MMcfd', change: -3.2, prefix: '' },
];

export function LiveMarketTicker({ initialItems: propItems }: { initialItems?: TickerItem[] }) {
  const [items, setItems] = useState<TickerItem[]>(propItems || initialItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate live micro-updates every ~25s for demo (professional, not frantic)
    const interval = setInterval(() => {
      setItems(prev => prev.map(item => {
        if (Math.random() > 0.6) {
          const delta = (Math.random() - 0.5) * (item.id === 'fx' || item.id === 'tariff' ? 0.15 : item.value > 50 ? 1.2 : 0.008);
          const newVal = Math.max(0.01, parseFloat((item.value + delta).toFixed(item.value > 100 ? 1 : 2)));
          const newChange = parseFloat(((newVal - item.value) / item.value * 100 * (item.id === 'fx' ? 5 : 1)).toFixed(1));
          return { ...item, value: newVal, change: newChange };
        }
        return item;
      }));
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full">
      <div className="container px-0">
        <div className="border-l border-r border-b border-border/40 bg-[var(--bg-elev)]/60 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center h-9 text-[11px] px-5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 pr-4 border-r border-border/60 text-muted-foreground shrink-0 mr-4">
              <span className="font-semibold tracking-[1px] text-[10px] uppercase">Live Markets</span>
            </div>

            <div className="flex-1 overflow-hidden relative mask-fade">
              <div className="flex w-max items-center gap-8 animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap">
                {[...items, ...items].map((item, idx) => {
                  const isPositive = item.change >= 0;
                  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
                  return (
                    <div key={`${item.id}-${idx}`} className="flex items-center gap-2 text-muted-foreground shrink-0">
                      <span className="font-medium text-foreground/90">{item.name}</span>
                      <span className="font-mono tabular-nums text-foreground">
                        {item.prefix}{item.value.toLocaleString()}
                        {item.unit && <span className="ml-0.5 text-[10px] text-muted-foreground/80">{item.unit}</span>}
                      </span>
                      <span 
                        className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-px rounded ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                        style={{ background: isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)' }}
                      >
                        {isPositive ? '+' : ''}{item.change}% <ChangeIcon className="h-3 w-3" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .mask-fade {
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
      `}</style>
    </div>
  );
}
