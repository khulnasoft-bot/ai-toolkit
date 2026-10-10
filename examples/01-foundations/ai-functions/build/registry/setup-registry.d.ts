import 'dotenv/config';
export declare const registry: import("@ai-toolkit/ai").ProviderRegistryProvider<{
    mistral: import("@ai-toolkit/mistral").MistralProvider;
    anthropic: import("@ai-toolkit/provider").ProviderV3 & {
        languageModel(modelId: "opus" | "sonnet" | "haiku"): import("@ai-toolkit/provider").LanguageModelV3;
        embeddingModel(modelId: string): import("@ai-toolkit/provider").EmbeddingModelV3;
        imageModel(modelId: string): import("@ai-toolkit/provider").ImageModelV3;
        transcriptionModel(modelId: string): import("@ai-toolkit/provider").TranscriptionModelV3;
        rerankingModel(modelId: string): import("@ai-toolkit/provider").RerankingModelV3;
        speechModel(modelId: string): import("@ai-toolkit/provider").SpeechModelV3;
    };
    openai: import("@ai-toolkit/provider").ProviderV3 & {
        languageModel(modelId: "gpt-4" | "gpt-4o-high-reasoning"): import("@ai-toolkit/provider").LanguageModelV3;
        embeddingModel(modelId: string): import("@ai-toolkit/provider").EmbeddingModelV3;
        imageModel(modelId: string): import("@ai-toolkit/provider").ImageModelV3;
        transcriptionModel(modelId: string): import("@ai-toolkit/provider").TranscriptionModelV3;
        rerankingModel(modelId: string): import("@ai-toolkit/provider").RerankingModelV3;
        speechModel(modelId: string): import("@ai-toolkit/provider").SpeechModelV3;
    };
    xai: import("@ai-toolkit/xai").XaiProvider;
    groq: import("@ai-toolkit/groq").GroqProvider;
    elevenlabs: import("@ai-toolkit/elevenlabs").ElevenLabsProvider;
}, ":">;
export declare const myImageModels: import("@ai-toolkit/provider").ProviderV3 & {
    languageModel(modelId: string): import("@ai-toolkit/provider").LanguageModelV3;
    embeddingModel(modelId: string): import("@ai-toolkit/provider").EmbeddingModelV3;
    imageModel(modelId: "recraft" | "photon" | "flux"): import("@ai-toolkit/provider").ImageModelV3;
    transcriptionModel(modelId: string): import("@ai-toolkit/provider").TranscriptionModelV3;
    rerankingModel(modelId: string): import("@ai-toolkit/provider").RerankingModelV3;
    speechModel(modelId: string): import("@ai-toolkit/provider").SpeechModelV3;
};
