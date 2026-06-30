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
    price: 5722.54,
    change: -0.42,
    kind: 'index',
  },
  {
    id: 'ds30',
    symbol: 'DS30',
    name: 'DSE 30 Index',
    nameBn: 'ডিএসই ৩০ সূচক',
    price: 2162.57,
    change: 0.18,
    kind: 'index',
  },
  {
    id: 'summitpower',
    symbol: 'SUMMITPOWER',
    name: 'Summit Power',
    nameBn: 'সামিট পাওয়ার',
    price: 15.30,
    change: -0.82,
    kind: 'equity',
  },
  {
    id: 'upgdcl',
    symbol: 'UPGDCL',
    name: 'United Power',
    nameBn: 'ইউনাইটেড পাওয়ার',
    price: 123.50,
    change: 0.35,
    kind: 'equity',
  },
  {
    id: 'powergrid',
    symbol: 'POWERGRID',
    name: 'Power Grid Co.',
    nameBn: 'পাওয়ার গ্রিড',
    price: 39.00,
    change: -1.15,
    kind: 'equity',
  },
  {
    id: 'desco',
    symbol: 'DESCO',
    name: 'DESCO',
    nameBn: 'ডেসকো',
    price: 23.90,
    change: 0.12,
    kind: 'equity',
  },
  {
    id: 'jamunaoil',
    symbol: 'JAMUNAOIL',
    name: 'Jamuna Oil',
    nameBn: 'যমুনা অয়েল',
    price: 178.90,
    change: -0.65,
    kind: 'equity',
  },
  {
    id: 'mpetroleum',
    symbol: 'MPETROLEUM',
    name: 'Meghna Petroleum',
    nameBn: 'মেঘনা পেট্রোলিয়াম',
    price: 214.10,
    change: 0.22,
    kind: 'equity',
  },
  {
    id: 'padmaoil',
    symbol: 'PADMAOIL',
    name: 'Padma Oil',
    nameBn: 'পদ্মা অয়েল',
    price: 190.80,
    change: -0.45,
    kind: 'equity',
  },
  {
    id: 'doreenpwr',
    symbol: 'DOREENPWR',
    name: 'Doreen Power',
    nameBn: 'ডরিন পাওয়ার',
    price: 31.80,
    change: 0.55,
    kind: 'equity',
  },
  {
    id: 'kpcl',
    symbol: 'KPCL',
    name: 'Khulna Power',
    nameBn: 'খুলনা পাওয়ার',
    price: 10.60,
    change: -0.15,
    kind: 'equity',
  },
  {
    id: 'barakapwr',
    symbol: 'BARAKAPWR',
    name: 'Baraka Power',
    nameBn: 'বারাকা পাওয়ার',
    price: 18.50,
    change: 0.72,
    kind: 'equity',
  },
  {
    id: 'spcl',
    symbol: 'SPCL',
    name: 'Shahajibazar Power',
    nameBn: 'শাহজিবাজার পাওয়ার',
    price: 54.50,
    change: -0.28,
    kind: 'equity',
  },
  {
    id: 'mjlbd',
    symbol: 'MJLBD',
    name: 'MJL Bangladesh',
    nameBn: 'এমজেএল বাংলাদেশ',
    price: 93.30,
    change: -0.58,
    kind: 'equity',
  },
  {
    id: 'intraco',
    symbol: 'INTRACO',
    name: 'Intraco Refueling',
    nameBn: 'ইন্ট্র্যাকো রিফুয়েলিং',
    price: 20.10,
    change: 0.42,
    kind: 'equity',
  },
  {
    id: 'gbbpower',
    symbol: 'GBBPOWER',
    name: 'GBB Power',
    nameBn: 'জিবিবি পাওয়ার',
    price: 8.30,
    change: -0.12,
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