'use client';

import { Fragment, useMemo, useState } from 'react';
import type { CatalogEntry } from '@/lib/catalog';
import { line, muted, wash } from '../site';

type SortKey = 'name' | 'input' | 'output' | 'context';

function contextTokens(context: string): number {
  const match = context.match(/^([\d.]+)(K|M)?$/);
  if (!match) return 0;
  const value = Number(match[1]);
  const multiplier = match[2] === 'M' ? 1_000_000 : match[2] === 'K' ? 1000 : 1;
  return value * multiplier;
}

function formatPrice(value: number): string {
  return `$${value.toFixed(value < 1 ? 2 : 1)}/1M`;
}

const cell: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: `1px solid ${line}`,
  verticalAlign: 'top',
};

const chip = (active: boolean): React.CSSProperties => ({
  padding: '6px 12px',
  borderRadius: 999,
  fontSize: 13,
  cursor: 'pointer',
  border: `1px solid ${active ? '#171717' : line}`,
  background: active ? '#171717' : '#fff',
  color: active ? '#fff' : '#171717',
});

export function ModelsBrowser({ models }: { models: CatalogEntry[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [provider, setProvider] = useState('all');
  const [tag, setTag] = useState('all');
  const [sort, setSort] = useState<SortKey>('input');
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const types = useMemo(
    () => ['all', ...new Set(models.map(m => m.type))],
    [models],
  );
  const providers = useMemo(
    () => [
      'all',
      ...new Set(models.flatMap(m => m.providers.map(p => p.provider))),
    ],
    [models],
  );
  const tags = useMemo(
    () => ['all', ...new Set(models.flatMap(m => m.tags))],
    [models],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = models.filter(
      entry =>
        (type === 'all' || entry.type === type) &&
        (provider === 'all' ||
          entry.providers.some(p => p.provider === provider)) &&
        (tag === 'all' || entry.tags.includes(tag)) &&
        (!q ||
          entry.id.toLowerCase().includes(q) ||
          entry.description.toLowerCase().includes(q) ||
          entry.tags.some(t => t.toLowerCase().includes(q))),
    );
    const priceOf = (entry: CatalogEntry, key: 'input' | 'output') =>
      key === 'input'
        ? (entry.price?.inputPer1M ?? Number.MAX_SAFE_INTEGER)
        : (entry.price?.outputPer1M ?? Number.MAX_SAFE_INTEGER);
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.id.localeCompare(b.id);
        case 'output':
          return priceOf(a, 'output') - priceOf(b, 'output');
        case 'context':
          return contextTokens(b.context) - contextTokens(a.context);
        case 'input':
        default:
          return priceOf(a, 'input') - priceOf(b, 'input');
      }
    });
  }, [models, query, type, provider, tag, sort]);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(
        () => setCopied(current => (current === key ? null : current)),
        1500,
      );
    } catch {
      // clipboard unavailable
    }
  };

  const curlFor = (id: string) =>
    `curl -N http://localhost:3000/v1/chat -H "Authorization: Bearer ak_..." -H 'Content-Type: application/json' -d '{"model":"${id}","messages":[]}'`;

  return (
    <div>
      <input
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder="Search models, tags, descriptions…"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '12px 16px',
          fontSize: 15,
          border: `1px solid ${line}`,
          borderRadius: 8,
          outline: 'none',
          marginBottom: 12,
        }}
      />
      {(
        [
          ['Type', types, type, setType],
          ['Provider', providers, provider, setProvider],
          ['Capability', tags, tag, setTag],
        ] as const
      ).map(([label, options, value, setValue]) => (
        <div
          key={label}
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 12, color: muted, width: 72 }}>{label}</span>
          {options.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setValue(option)}
              style={chip(value === option)}
            >
              {option}
            </button>
          ))}
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          margin: '8px 0 16px',
        }}
      >
        <span style={{ fontSize: 12, color: muted, width: 72 }}>Sort</span>
        {(
          [
            ['input', 'Input price'],
            ['output', 'Output price'],
            ['context', 'Context'],
            ['name', 'Name'],
          ] as [SortKey, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSort(key)}
            style={chip(sort === key)}
          >
            {label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: muted }}>
          {filtered.length} of {models.length} models
        </span>
      </div>

      <div
        style={{
          border: `1px solid ${line}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 14,
              minWidth: 760,
            }}
          >
            <thead>
              <tr style={{ background: wash, textAlign: 'left' }}>
                {[
                  'Model',
                  'Type',
                  'Context',
                  'Input',
                  'Output',
                  'Providers',
                  'Tags',
                ].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 16px',
                      fontWeight: 600,
                      borderBottom: `1px solid ${line}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <Fragment key={entry.id}>
                  <tr
                    key={entry.id}
                    onClick={() =>
                      setOpen(current =>
                        current === entry.id ? null : entry.id,
                      )
                    }
                    style={{
                      borderBottom: `1px solid ${line}`,
                      cursor: 'pointer',
                    }}
                  >
                    <td
                      style={{ ...cell, fontFamily: 'monospace', fontSize: 13 }}
                    >
                      {entry.id}
                    </td>
                    <td style={cell}>{entry.type}</td>
                    <td style={{ ...cell, fontFamily: 'monospace' }}>
                      {entry.context}
                    </td>
                    <td style={cell}>
                      {entry.price
                        ? formatPrice(entry.price.inputPer1M)
                        : 'unpriced'}
                    </td>
                    <td style={cell}>
                      {entry.price
                        ? formatPrice(entry.price.outputPer1M)
                        : 'unpriced'}
                    </td>
                    <td style={{ ...cell, color: muted }}>
                      {entry.providers.map(p => p.provider).join(', ')}
                    </td>
                    <td style={{ ...cell, color: muted, fontSize: 13 }}>
                      {entry.tags.join(', ')}
                    </td>
                  </tr>
                  {open === entry.id && (
                    <tr style={{ background: wash }}>
                      <td
                        colSpan={7}
                        style={{
                          padding: '16px 20px',
                          borderBottom: `1px solid ${line}`,
                        }}
                      >
                        <p style={{ margin: '0 0 8px', lineHeight: 1.6 }}>
                          {entry.description}
                        </p>
                        <p
                          style={{
                            margin: '0 0 12px',
                            fontSize: 13,
                            color: muted,
                          }}
                        >
                          Failover order:{' '}
                          {entry.providers
                            .map(p => `${p.provider}/${p.model}`)
                            .join('  →  ')}
                          {'  ·  '}strategy {entry.strategy} · budget{' '}
                          {entry.retryBudget}
                          {entry.routedViaFallback ? '  ·  via fallback' : ''}
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() =>
                              void copy(`${entry.id}-id`, entry.id)
                            }
                            style={chip(false)}
                          >
                            {copied === `${entry.id}-id`
                              ? 'Copied!'
                              : 'Copy model ID'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void copy(`${entry.id}-curl`, curlFor(entry.id))
                            }
                            style={chip(false)}
                          >
                            {copied === `${entry.id}-curl`
                              ? 'Copied!'
                              : 'Copy curl'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: 32, textAlign: 'center', color: muted }}
                  >
                    No models match. Clear search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
