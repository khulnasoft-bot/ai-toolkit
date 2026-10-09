import { RecipeBrowser } from '@/components/recipe-browser';
import { PageTabs } from '@/components/page-tabs';
import { SectionHeader } from '@/components/section-header';
import { getAllRecipes, getCategoriesWithCounts } from '@/lib/recipes';
import { resourcesTabs } from '@/lib/site-nav';

export const metadata = {
  title: 'Recipes',
};

export default function RecipesPage() {
  const categories = getCategoriesWithCounts();
  const recipes = getAllRecipes();

  return (
    <div>
      <PageTabs items={resourcesTabs} />
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SectionHeader
          eyebrow="Recipes"
          title="Build specific AI features faster."
          description="Focused, production-ready recipes with runnable examples — from structured extraction to durable agents. Each recipe ships complete client and server code."
        />
        <div className="mt-10">
          <RecipeBrowser categories={categories} recipes={recipes} />
        </div>
      </div>
    </div>
  );
}
