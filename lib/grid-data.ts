type GridMixItem = { name: string; value: number; mw: number };
type GridLineItem = { name: string; status: string; capacity: string; owner: string; load: number };
type GridProjectItem = { name: string; status: string; mw: string; date: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asGridMix(value: unknown): GridMixItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter(
    (item): item is GridMixItem =>
      isRecord(item) &&
      typeof item.name === 'string' &&
      typeof item.value === 'number' &&
      typeof item.mw === 'number',
  );
  return items.length ? items : undefined;
}

function asGridLines(value: unknown): GridLineItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter(
    (item): item is GridLineItem =>
      isRecord(item) &&
      typeof item.name === 'string' &&
      typeof item.status === 'string' &&
      typeof item.capacity === 'string' &&
      typeof item.owner === 'string' &&
      typeof item.load === 'number',
  );
  return items.length ? items : undefined;
}

function asGridProjects(value: unknown): GridProjectItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter(
    (item): item is GridProjectItem =>
      isRecord(item) &&
      typeof item.name === 'string' &&
      typeof item.status === 'string' &&
      typeof item.mw === 'string' &&
      typeof item.date === 'string',
  );
  return items.length ? items : undefined;
}

export function normalizeGridSettings(settings: Record<string, unknown>) {
  return {
    gridMix: asGridMix(settings.gridMix),
    gridLines: asGridLines(settings.gridLines),
    gridProjects: asGridProjects(settings.gridProjects),
  };
}