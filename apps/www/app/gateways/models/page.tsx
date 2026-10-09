import { PageTabs } from '@/components/page-tabs';
import { GatewayModelsBrowser } from '@/components/gateway-models-browser';
import { SectionHeader } from '@/components/section-header';
import {
  getGatewayModelCounts,
  getGatewayModels,
  getGatewayModelProviders,
} from '@/lib/gateway-models';
import { gatewaysTabs } from '@/lib/site-nav';

export const metadata = {
  title: 'AI Gateway Models',
};

export default function GatewayModelsPage() {
  const models = getGatewayModels();
  const providers = getGatewayModelProviders();
  const counts = getGatewayModelCounts();

  return (
    <div>
      <PageTabs items={gatewaysTabs} />
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SectionHeader
          eyebrow="AI Gateway models"
          title={`One API key, ${models.length} models.`}
          description="Every model available through the AI Gateway — language, embedding, and image models from OpenAI, Anthropic, Google, Meta, xAI, and more, all through a single endpoint."
        />

        <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-4 border-y border-border py-6 text-center">
          <div>
            <dt className="eyebrow">Language</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">
              {counts.language}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Embedding</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">
              {counts.embedding}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Image</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">
              {counts.image}
            </dd>
          </div>
        </dl>

        <div className="mt-8">
          <GatewayModelsBrowser models={models} providers={providers} />
        </div>
      </div>
    </div>
  );
}
