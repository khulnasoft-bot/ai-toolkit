import { createTransformer } from '../lib/create-transformer';

export default createTransformer((_fileInfo, _api, _options, context) => {
  const { j, root } = context;

  root.find(j.ImportDeclaration, { source: { value: '@ai-toolkit/ui-utils' } }).forEach(path => {
    path.node.source.value = 'ai-toolkit';
    context.hasChanges = true;
  });
});
