/**
 * Model pricing contracts for spend tracking.
 *
 * Prices are per 1k tokens, split into input and output. A {@link PriceTable}
 * is loaded from a versioned JSON document ({@link loadPriceTable}) so prices
 * stay auditable and reviewable. {@link priceUsage} never invents a price:
 * models without a matching entry are reported with `priced: false` so
 * callers surface them as "unpriced" instead of silently recording $0.
 */

/** Token counts observed from a completed model call. Never client-reported. */
export interface TokenUsage {
  readonly promptTokens: number;
  readonly completionTokens: number;
}

/** Price for the models matching `modelPattern`, in `currency` per 1k tokens. */
export interface PriceEntry {
  /**
   * Exact model ID (`'openai/gpt-4o'`), prefix wildcard (`'openai/*'`),
   * or `'*'`. First matching entry wins.
   */
  readonly modelPattern: string;
  readonly inputPer1k: number;
  readonly outputPer1k: number;
  readonly currency: string;
}

/** Versioned set of price entries. */
export interface PriceTable {
  readonly version: number;
  readonly currency: string;
  readonly entries: readonly PriceEntry[];
}

/** Result of pricing one call. */
export interface PricedUsage {
  readonly cost: number;
  readonly currency: string;
  /** False when no entry matched — the call must be reported, not hidden. */
  readonly priced: boolean;
}

function matchPattern(pattern: string, modelId: string): boolean {
  if (pattern === '*') return true;
  if (pattern.endsWith('*')) {
    return modelId.startsWith(pattern.slice(0, -1));
  }
  return pattern === modelId;
}

/**
 * Price one call. Returns `priced: false` with `cost: 0` when no entry
 * matches the model ID.
 */
export function priceUsage(
  table: PriceTable,
  modelId: string,
  usage: TokenUsage,
): PricedUsage {
  for (const entry of table.entries) {
    if (!matchPattern(entry.modelPattern, modelId)) continue;
    return {
      cost:
        (usage.promptTokens / 1000) * entry.inputPer1k +
        (usage.completionTokens / 1000) * entry.outputPer1k,
      currency: entry.currency,
      priced: true,
    };
  }
  return { cost: 0, currency: table.currency, priced: false };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Validate and normalize an unknown JSON document into a {@link PriceTable}.
 * Throws a descriptive `Error` for malformed documents.
 */
export function loadPriceTable(json: unknown): PriceTable {
  if (!isRecord(json)) {
    throw new Error('price table must be a JSON object');
  }
  if (typeof json.version !== 'number' || !Number.isInteger(json.version)) {
    throw new Error('price table "version" must be an integer');
  }
  if (typeof json.currency !== 'string' || json.currency.length === 0) {
    throw new Error('price table "currency" must be a non-empty string');
  }
  if (!Array.isArray(json.entries)) {
    throw new Error('price table "entries" must be an array');
  }
  const entries: PriceEntry[] = json.entries.map((entry, index) => {
    const where = `entries[${index}]`;
    if (!isRecord(entry)) {
      throw new Error(`price table ${where} must be an object`);
    }
    if (
      typeof entry.modelPattern !== 'string' ||
      entry.modelPattern.length === 0
    ) {
      throw new Error(
        `price table ${where} "modelPattern" must be a non-empty string`,
      );
    }
    for (const field of ['inputPer1k', 'outputPer1k'] as const) {
      if (
        typeof entry[field] !== 'number' ||
        !((entry[field] as number) >= 0)
      ) {
        throw new Error(
          `price table ${where} "${field}" must be a number >= 0`,
        );
      }
    }
    if (typeof entry.currency !== 'string' || entry.currency.length === 0) {
      throw new Error(
        `price table ${where} "currency" must be a non-empty string`,
      );
    }
    return {
      modelPattern: entry.modelPattern,
      inputPer1k: entry.inputPer1k as number,
      outputPer1k: entry.outputPer1k as number,
      currency: entry.currency,
    };
  });
  return { version: json.version, currency: json.currency, entries };
}
