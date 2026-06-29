import { Activity, Database, Droplet, Globe, Sun, type LucideIcon } from 'lucide-react';
import type { SredaRenewableItem } from '@/lib/data/companies/sreda';

const ICON_MAP: Record<SredaRenewableItem['iconName'], LucideIcon> = {
  Sun,
  Droplet,
  Globe,
  Activity,
  Database,
};

export function sredaItemsWithIcons(items: SredaRenewableItem[]) {
  return items.map((item) => ({
    ...item,
    icon: ICON_MAP[item.iconName],
  }));
}