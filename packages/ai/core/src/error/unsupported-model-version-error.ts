import { AITOOLKITError } from '@ai-toolkit/provider';

/**
Error that is thrown when a model with an unsupported version is used.
 */
export class UnsupportedModelVersionError extends AITOOLKITError {
  readonly version: string;
  readonly provider: string;
  readonly modelId: string;

  constructor(options: { version: string; provider: string; modelId: string }) {
    super({
      name: 'AI_UnsupportedModelVersionError',
      message:
        `Unsupported model version ${options.version} for provider "${options.provider}" and model "${options.modelId}". ` +
        `AI TOOLKIT 5 only supports models that implement specification version "v2".`,
    });

    this.version = options.version;
    this.provider = options.provider;
    this.modelId = options.modelId;
  }
}
