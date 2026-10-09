import { createTransformer } from '../lib/create-transformer';

export default createTransformer((_fileInfo, _api, _options, context) => {
  const { j, root } = context;

  root.find(j.ImportDeclaration).forEach(path => {
    const sourceValue = path.node.source.value as string;
    const match = sourceValue.match(/^ai\/(svelte|vue|solid)$/);
    if (match) {
      context.hasChanges = true;
      path.node.source.value = `@ai-toolkit/${match[1]}`;
    }
  });
});
