const cache = new Map();
export const yourCacheMiddleware = {
  specificationVersion: 'v3',
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    const result = await doGenerate();
    cache.set(cacheKey, result);
    return result;
  },
  // here you would implement the caching logic for streaming
};
//# sourceMappingURL=your-cache-middleware.js.map
