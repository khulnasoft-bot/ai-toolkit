import { APICallError } from '@ai-toolkit/ai';
import type { EmbeddingModelV3, ImageModelV3, LanguageModelV3 } from '@ai-toolkit/provider';
export type Capability = 'audioInput' | 'embedding' | 'imageGeneration' | 'imageInput' | 'objectGeneration' | 'pdfInput' | 'searchGrounding' | 'textCompletion' | 'toolCalls';
export type ModelCapabilities = Capability[];
export interface ModelWithCapabilities<T> {
    model: T;
    capabilities?: ModelCapabilities;
}
export declare const defaultChatModelCapabilities: ModelCapabilities;
export declare const createLanguageModelWithCapabilities: (model: LanguageModelV3, capabilities?: ModelCapabilities) => ModelWithCapabilities<LanguageModelV3>;
export declare const createEmbeddingModelWithCapabilities: (model: EmbeddingModelV3, capabilities?: ModelCapabilities) => ModelWithCapabilities<EmbeddingModelV3>;
export declare const createImageModelWithCapabilities: (model: ImageModelV3, capabilities?: ModelCapabilities) => ModelWithCapabilities<ImageModelV3>;
export interface ModelVariants {
    invalidModel?: LanguageModelV3;
    languageModels?: ModelWithCapabilities<LanguageModelV3>[];
    embeddingModels?: ModelWithCapabilities<EmbeddingModelV3>[];
    invalidImageModel?: ImageModelV3;
    imageModels?: ModelWithCapabilities<ImageModelV3>[];
}
export interface TestSuiteOptions {
    name: string;
    models: ModelVariants;
    timeout?: number;
    customAssertions?: {
        skipUsage?: boolean;
        errorValidator?: (error: APICallError) => void;
    };
}
export declare function createFeatureTestSuite({ name, models, timeout, customAssertions, }: TestSuiteOptions): () => void;
