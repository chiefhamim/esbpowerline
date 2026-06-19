/** Bangladesh stock market (DSE) snapshot types and baseline data. */

export type DseTickerItem = {
  id: string;
  symbol: string;
  name: string;
  nameBn: string;
  price: number;
  change: number;
  /** Index vs equity */
  kind: 'index' | 'equity';
};

export const DEFAULT_DSE_TICKER: DseTickerItem[] = [
  {
    id: 'dsex',
    symbol: 'DSEX',
    name: 'DSE Broad Index',
    nameBn: 'ডিএসই প্রধান সূচক',
    price: 6124.38,
    change: 0.42,
    kind: 'index',
  },
  {
    id: 'ds30',
    symbol: 'DS30',
    name: 'DSE 30 Index',
    nameBn: 'ডিএসই ৩০ সূচক',
    price: 2148.65,
    change: -0.18,
    kind: 'index',
  },
  {
    id: 'gp',
    symbol: 'GP',
    name: 'Grameenphone',
    nameBn: 'গ্রামীণফোন',
    price: 298.7,
    change: 1.12,
    kind: 'equity',
  },
  {
    id: 'squrpharma',
    symbol: 'SQURPHARMA',
    name: 'Square Pharma',
    nameBn: 'স্কয়ার ফার্মা',
    price: 228.4,
    change: -0.65,
    kind: 'equity',
  },
  {
    id: 'batbc',
    symbol: 'BATBC',
    name: 'BAT Bangladesh',
    nameBn: 'বিএটি বাংলাদেশ',
    price: 318.2,
    change: 0.28,
    kind: 'equity',
  },
  {
    id: 'marico',
    symbol: 'MARICO',
    name: 'Marico Bangladesh',
    nameBn: 'ম্যারিকো বাংলাদেশ',
    price: 2140.5,
    change: 0.91,
    kind: 'equity',
  },
  {
    id: 'bergerpbl',
    symbol: 'BERGERPBL',
    name: 'Berger Paints',
    nameBn: 'বার্জার পেইন্টস',
    price: 52.8,
    change: -1.05,
    kind: 'equity',
  },
  {
    id: 'reckittben',
    symbol: 'RECKITTBEN',
    name: 'Reckitt Benckiser',
    nameBn: 'রেকিট বেনকিজার',
    price: 3124.0,
    change: 0.34,
    kind: 'equity',
  },
];

export function jitterDseSnapshot(items: DseTickerItem[]): DseTickerItem[] {
  return items.map((item) => {
    const band = item.kind === 'index' ? 8 : item.price > 1000 ? 12 : 1.2;
    const delta = (Math.random() - 0.5) * band;
    const price = Math.max(0.01, parseFloat((item.price + delta).toFixed(item.price > 100 ? 2 : 1)));
    const change = parseFloat(
      (((price - item.price) / item.price) * 100 * (item.kind === 'index' ? 4 : 1)).toFixed(2),
    );
    return { ...item, price, change };
  });
}