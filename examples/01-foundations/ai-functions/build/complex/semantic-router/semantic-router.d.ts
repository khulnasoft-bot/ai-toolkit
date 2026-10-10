import { type EmbeddingModel } from '@ai-toolkit/ai';
export interface Route<NAME extends string> {
    name: NAME;
    values: string[];
}
/**
 * Routes values based on their distance to the values from a set of clusters.
 * When the distance is below a certain threshold, the value is classified as belonging to the route,
 * and the route name is returned. Otherwise, the value is classified as null.
 */
export declare class SemanticRouter<ROUTES extends Array<Route<string>>> {
    readonly routes: ROUTES;
    readonly embeddingModel: EmbeddingModel;
    readonly similarityThreshold: number;
    private routeValues;
    constructor({ routes, embeddingModel, similarityThreshold, }: {
        routes: ROUTES;
        embeddingModel: EmbeddingModel;
        similarityThreshold: number;
    });
    private getRouteValues;
    route(value: string): Promise<RouteNames<ROUTES> | null>;
}
type RouteNames<ROUTES> = ROUTES extends Array<Route<infer NAME>> ? NAME : never;
export {};
