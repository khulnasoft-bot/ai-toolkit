import type {
  ImageModelV4,
  ImageModelV4CallOptions,
  ImageModelV4Usage,
  SharedV4Warning,
} from '@ai-toolkit/provider';
import {
  combineHeaders,
  convertImageModelFileToDataUri,
  createJsonErrorResponseHandler,
  createJsonResponseHandler,
  parseProviderOptions,
  postJsonToApi,
  resolve,
} from '@ai-toolkit/provider-utils';
import { z } from 'zod/v4';
import type { ByteDanceConfig } from './bytedance-config';
import {
  byteDanceImageModelOptionsSchema,
  type ByteDanceImageModelOptions,
} from './bytedance-image-model-options';
import type { ByteDanceImageModelId } from './bytedance-image-settings';

const HANDLED_PROVIDER_OPTIONS = new Set([
  'watermark',
  'outputFormat',
  'size',
  'sequentialImageGeneration',
  'maxImages',
  'optimizePromptMode',
]);

interface ByteDanceImageModelConfig extends ByteDanceConfig {
  _internal?: {
    currentDate?: () => Date;
  };
}

export class ByteDanceImageModel implements ImageModelV4 {
  readonly specificationVersion = 'v4';
  readonly maxImagesPerCall = 1;

  get provider(): string {
    return this.config.provider;
  }

  constructor(
    readonly modelId: ByteDanceImageModelId,
    private readonly config: ByteDanceImageModelConfig,
  ) {}

  async doGenerate({
    prompt,
    size,
    aspectRatio,
    seed,
    providerOptions,
    headers,
    abortSignal,
    files,
    mask,
  }: ImageModelV4CallOptions): Promise<
    Awaited<ReturnType<ImageModelV4['doGenerate']>>
  > {
    const warnings: Array<SharedV4Warning> = [];

    if (aspectRatio != null) {
      warnings.push({
        type: 'unsupported',
        feature: 'aspectRatio',
        details:
          'ByteDance does not support aspectRatio. Use `size` (e.g. "2048x2048" ' +
          'or a resolution level like "2K" via providerOptions) instead.',
      });
    }

    if (seed != null) {
      warnings.push({ type: 'unsupported', feature: 'seed' });
    }

    if (mask != null) {
      warnings.push({
        type: 'unsupported',
        feature: 'mask',
        details:
          'ByteDance Seedream does not support a separate mask. Provide edit ' +
          'instructions in the prompt, optionally with markings on the input image.',
      });
    }

    const currentDate = this.config._internal?.currentDate?.() ?? new Date();

    const byteDanceOptions = (await parseProviderOptions({
      provider: 'bytedance',
      providerOptions,
      schema: byteDanceImageModelOptionsSchema,
    })) as ByteDanceImageModelOptions | undefined;

    const image =
      files != null && files.length > 0
        ? files.length === 1
          ? convertImageModelFileToDataUri(files[0])
          : files.map(convertImageModelFileToDataUri)
        : undefined;

    const body: Record<string, unknown> = {
      model: this.modelId,
      prompt,
    };

    if (image != null) {
      body.image = image;
    }

    if (size != null) {
      body.size = size;
    }

    if (byteDanceOptions != null) {
      if (byteDanceOptions.watermark != null) {
        body.watermark = byteDanceOptions.watermark;
      }
      if (byteDanceOptions.outputFormat != null) {
        body.output_format = byteDanceOptions.outputFormat;
      }
      if (byteDanceOptions.size != null) {
        body.size = byteDanceOptions.size;
      }
      if (byteDanceOptions.sequentialImageGeneration != null) {
        body.sequential_image_generation =
          byteDanceOptions.sequentialImageGeneration;
      }
      if (byteDanceOptions.maxImages != null) {
        body.sequential_image_generation_options = {
          max_images: byteDanceOptions.maxImages,
        };
      }
      if (byteDanceOptions.optimizePromptMode != null) {
        body.optimize_prompt_options = {
          mode: byteDanceOptions.optimizePromptMode,
        };
      }
      for (const [key, value] of Object.entries(byteDanceOptions)) {
        if (!HANDLED_PROVIDER_OPTIONS.has(key)) {
          body[key] = value;
        }
      }
    }

    body.response_format = 'b64_json';

    const { value: response, responseHeaders } = await postJsonToApi({
      url: `${this.config.baseURL}/images/generations`,
      headers: combineHeaders(await resolve(this.config.headers), headers),
      body,
      failedResponseHandler: byteDanceFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        byteDanceImageResponseSchema,
      ),
      abortSignal,
      fetch: this.config.fetch,
    });

    return {
      images: response.data.map(item => item.b64_json),
      warnings,
      usage: mapImageUsage(response.usage),
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders,
      },
    };
  }
}

function mapImageUsage(
  usage: z.infer<typeof byteDanceImageResponseSchema>['usage'],
): ImageModelV4Usage | undefined {
  return usage == null
    ? undefined
    : {
        inputTokens: undefined,
        outputTokens: usage.output_tokens ?? undefined,
        totalTokens: usage.total_tokens ?? undefined,
      };
}

const byteDanceImageResponseSchema = z.object({
  data: z.array(z.object({ b64_json: z.string() })),
  usage: z
    .object({
      output_tokens: z.number().nullish(),
      total_tokens: z.number().nullish(),
    })
    .nullish(),
});

const byteDanceErrorSchema = z.object({
  error: z
    .object({
      message: z.string(),
      code: z.string().nullish(),
    })
    .nullish(),
  message: z.string().nullish(),
});

const byteDanceFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: byteDanceErrorSchema,
  errorToMessage: data =>
    data.error?.message ?? data.message ?? 'Unknown error',
});
