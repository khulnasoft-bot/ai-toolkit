import { gateway } from '@ai-toolkit/gateway';
import type {
  EmbeddingModelV3,
  Experimental_VideoModelV4,
  ImageModelV3,
  LanguageModelV3,
  LanguageModelV4,
  ProviderV3,
  SpeechModelV3,
  TranscriptionModelV3,
} from '@ai-toolkit/provider';
import { UnsupportedModelVersionError } from '../error';
import type { EmbeddingModel } from '../types/embedding-model';
import type { ImageModel } from '../types/image-model';
import type { LanguageModel } from '../types/language-model';
import type { SpeechModel } from '../types/speech-model';
import type { TranscriptionModel } from '../types/transcription-model';
import type { VideoModel } from '../types/video-model';
import { asEmbeddingModelV3 } from './as-embedding-model-v3';
import { asImageModelV3 } from './as-image-model-v3';
import { asLanguageModelV3 } from './as-language-model-v3';
import { asLanguageModelV4 } from './as-language-model-v4';
import { asSpeechModelV3 } from './as-speech-model-v3';
import { asTranscriptionModelV3 } from './as-transcription-model-v3';
import { asVideoModelV4 } from './as-video-model-v4';

export function resolveLanguageModel(model: LanguageModel): LanguageModelV4 {
  if (typeof model !== 'string') {
    if (
      model.specificationVersion !== 'v4' &&
      model.specificationVersion !== 'v3' &&
      model.specificationVersion !== 'v2'
    ) {
      const unsupportedModel: any = model;
      throw new UnsupportedModelVersionError({
        version: unsupportedModel.specificationVersion,
        provider: unsupportedModel.provider,
        modelId: unsupportedModel.modelId,
      });
    }

    return asLanguageModelV4(model);
  }

  return asLanguageModelV4(getGlobalProvider().languageModel(model));
}

export function resolveEmbeddingModel(model: EmbeddingModel): EmbeddingModelV3 {
  if (typeof model !== 'string') {
    if (
      model.specificationVersion !== 'v3' &&
      model.specificationVersion !== 'v2'
    ) {
      const unsupportedModel: any = model;
      throw new UnsupportedModelVersionError({
        version: unsupportedModel.specificationVersion,
        provider: unsupportedModel.provider,
        modelId: unsupportedModel.modelId,
      });
    }

    return asEmbeddingModelV3(model);
  }

  return getGlobalProvider().embeddingModel(model);
}

export function resolveTranscriptionModel(
  model: TranscriptionModel,
): TranscriptionModelV3 | undefined {
  if (typeof model !== 'string') {
    if (
      model.specificationVersion !== 'v3' &&
      model.specificationVersion !== 'v2'
    ) {
      const unsupportedModel: any = model;
      throw new UnsupportedModelVersionError({
        version: unsupportedModel.specificationVersion,
        provider: unsupportedModel.provider,
        modelId: unsupportedModel.modelId,
      });
    }
    return asTranscriptionModelV3(model);
  }

  return getGlobalProvider().transcriptionModel?.(model);
}

export function resolveSpeechModel(
  model: SpeechModel,
): SpeechModelV3 | undefined {
  if (typeof model !== 'string') {
    if (
      model.specificationVersion !== 'v3' &&
      model.specificationVersion !== 'v2'
    ) {
      const unsupportedModel: any = model;
      throw new UnsupportedModelVersionError({
        version: unsupportedModel.specificationVersion,
        provider: unsupportedModel.provider,
        modelId: unsupportedModel.modelId,
      });
    }
    return asSpeechModelV3(model);
  }

  return getGlobalProvider().speechModel?.(model);
}

export function resolveImageModel(model: ImageModel): ImageModelV3 {
  if (typeof model !== 'string') {
    if (
      model.specificationVersion !== 'v3' &&
      model.specificationVersion !== 'v2'
    ) {
      const unsupportedModel: any = model;
      throw new UnsupportedModelVersionError({
        version: unsupportedModel.specificationVersion,
        provider: unsupportedModel.provider,
        modelId: unsupportedModel.modelId,
      });
    }

    return asImageModelV3(model);
  }

  return getGlobalProvider().imageModel(model);
}

export function resolveVideoModel(
  model: VideoModel,
): Experimental_VideoModelV4 {
  if (typeof model === 'string') {
    const provider = getGlobalProvider();
    // TODO AI SDK v7
    // @ts-expect-error - videoModel support is experimental
    const videoModel = provider.videoModel;

    if (!videoModel) {
      throw new Error(
        'The default provider does not support video models. ' +
          'Please use an Experimental_VideoModelV4 object from a provider (e.g., provider.video("model-id")).',
      );
    }

    return videoModel(model);
  }

  if (
    model.specificationVersion !== 'v4' &&
    model.specificationVersion !== 'v3'
  ) {
    const unsupportedModel: any = model;
    throw new UnsupportedModelVersionError({
      version: unsupportedModel.specificationVersion,
      provider: unsupportedModel.provider,
      modelId: unsupportedModel.modelId,
    });
  }

  return asVideoModelV4(model);
}

function getGlobalProvider(): ProviderV3 {
  return globalThis.AI_TOOLKIT_DEFAULT_PROVIDER ?? gateway;
}
