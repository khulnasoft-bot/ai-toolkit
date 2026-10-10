import type { Telemetry } from './telemetry';

declare global {
  // eslint-disable-next-line no-var
  var AI_SDK_TELEMETRY_INTEGRATIONS: Telemetry[] | undefined;
}

export function registerTelemetry(...integrations: Telemetry[]): void {
  if (!globalThis.AI_SDK_TELEMETRY_INTEGRATIONS) {
    globalThis.AI_SDK_TELEMETRY_INTEGRATIONS = [];
  }
  globalThis.AI_SDK_TELEMETRY_INTEGRATIONS.push(...integrations);
}

export function getGlobalTelemetryIntegrations(): Telemetry[] {
  return globalThis.AI_SDK_TELEMETRY_INTEGRATIONS ?? [];
}
