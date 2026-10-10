import { cosineSimilarity, embed, embedMany } from '@ai-toolkit/ai';
/**
 * Routes values based on their distance to the values from a set of clusters.
 * When the distance is below a certain threshold, the value is classified as belonging to the route,
 * and the route name is returned. Otherwise, the value is classified as null.
 */
export class SemanticRouter {
  routes;
  embeddingModel;
  similarityThreshold;
  routeValues;
  constructor({ routes, embeddingModel, similarityThreshold }) {
    this.routes = routes;
    this.embeddingModel = embeddingModel;
    this.similarityThreshold = similarityThreshold;
  }
  async getRouteValues() {
    if (this.routeValues != null) {
      return this.routeValues;
    }
    this.routeValues = [];
    for (const route of this.routes) {
      const { embeddings } = await embedMany({
        model: this.embeddingModel,
        values: route.values,
      });
      for (let i = 0; i < embeddings.length; i++) {
        this.routeValues.push({
          routeName: route.name,
          routeValue: route.values[i],
          embedding: embeddings[i],
        });
      }
    }
    return this.routeValues;
  }
  async route(value) {
    const { embedding } = await embed({ model: this.embeddingModel, value });
    const routeValues = await this.getRouteValues();
    const allMatches = [];
    for (const routeValue of routeValues) {
      const similarity = cosineSimilarity(embedding, routeValue.embedding);
      if (similarity >= this.similarityThreshold) {
        allMatches.push({
          similarity,
          routeValue: routeValue.routeValue,
          routeName: routeValue.routeName,
        });
      }
    }
    // sort (highest similarity first)
    allMatches.sort((a, b) => b.similarity - a.similarity);
    return allMatches.length > 0 ? allMatches[0].routeName : null;
  }
}
//# sourceMappingURL=semantic-router.js.map
