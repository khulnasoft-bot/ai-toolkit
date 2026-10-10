export function print(label, value, options = { depth: Infinity }) {
  console.log(label);
  console.dir(removeUndefinedEntries(value), { depth: options.depth });
}
function removeUndefinedEntries(record) {
  if (record == null || typeof record !== 'object') {
    return record;
  }
  if (Array.isArray(record)) {
    return record.map(removeUndefinedEntries);
  }
  return Object.fromEntries(
    Object.entries(record)
      .filter(([_key, value]) => value != null)
      .map(([key, value]) => [key, removeUndefinedEntries(value)]),
  );
}
//# sourceMappingURL=print.js.map
