/** Simulated live telemetry (ticker jitter, snapshot drift) — dev/QA only. */
export function isSimulatedTelemetryEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}