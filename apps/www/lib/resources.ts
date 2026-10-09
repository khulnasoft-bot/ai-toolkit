import { getAllRecipes } from './recipes';
import { showcaseItems } from './showcase';
import { getAllTemplates } from './templates';
import { tools } from './tools';

export type ResourceKind = 'recipes' | 'tools' | 'templates' | 'showcase';

export interface ResourceEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  meta?: string;
  external?: boolean;
}

export interface ResourceGroup {
  kind: ResourceKind;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  entries: ResourceEntry[];
}

export interface RegisteredResource extends ResourceEntry {
  kind: ResourceKind;
}

export class ResourcesRegistry {
  private readonly groups: ResourceGroup[] = [];

  add(group: ResourceGroup): this {
    this.groups.push(group);
    return this;
  }

  get(kind: ResourceKind): ResourceGroup | undefined {
    return this.groups.find(group => group.kind === kind);
  }

  getKinds(): ResourceGroup[] {
    return this.groups.slice();
  }

  count(kind: ResourceKind): number {
    return this.get(kind)?.entries.length ?? 0;
  }

  get all(): RegisteredResource[] {
    return this.groups.flatMap(group =>
      group.entries.map(entry => ({ ...entry, kind: group.kind })),
    );
  }
}

export const resources = new ResourcesRegistry()
  .add({
    kind: 'recipes',
    eyebrow: 'Recipes',
    title: 'Recipes',
    description: 'Build specific AI features faster.',
    href: '/resources/recipes',
    entries: getAllRecipes().map(recipe => ({
      id: recipe.slug,
      title: recipe.title,
      description: recipe.description,
      href: `/resources/recipes/${recipe.category}/${recipe.slug}`,
      meta: `${recipe.categoryTitle} · ${recipe.readTime} min`,
    })),
  })
  .add({
    kind: 'tools',
    eyebrow: 'Tools Registry',
    title: 'Tools Registry',
    description: 'Give your agent superpowers.',
    href: '/resources/tools',
    entries: tools.map(tool => ({
      id: tool.slug,
      title: tool.name,
      description: tool.description,
      href: '/resources/tools',
      meta: tool.packageName,
    })),
  })
  .add({
    kind: 'templates',
    eyebrow: 'Templates',
    title: 'Templates',
    description: 'Start from a real app.',
    href: '/resources/templates',
    entries: getAllTemplates().map(template => ({
      id: template.name,
      title: template.title,
      description: template.description,
      href: '/resources/templates',
      meta: template.framework,
    })),
  })
  .add({
    kind: 'showcase',
    eyebrow: 'Showcase',
    title: 'Showcase',
    description: 'See what people are shipping.',
    href: '/resources/showcase',
    entries: showcaseItems.map(item => ({
      id: item.name,
      title: item.name,
      description: item.description,
      href: item.url,
      external: true,
      meta: item.tag,
    })),
  });
