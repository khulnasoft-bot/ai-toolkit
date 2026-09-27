import { createTransformer } from '../lib/create-transformer';

const sourceMapping: Record<string, string> = {
  ai: 'ai-toolkit',
  'ai/test': 'ai-toolkit/test',
  'ai/internal': 'ai-toolkit/internal',
};

/**
 * Codemod to rename imports from 'ai' to 'ai-toolkit'.
 * Handles static imports, re-exports, dynamic import() and require() calls.
 */
export default createTransformer((fileInfo, api, options, context) => {
  const { j, root } = context;

  const renameSource = (value: unknown): value is string =>
    typeof value === 'string' && value in sourceMapping;

  // Static imports: import ... from 'ai'
  root.find(j.ImportDeclaration).forEach(path => {
    const value = path.node.source.value;
    if (renameSource(value)) {
      path.node.source.value = sourceMapping[value];
      context.hasChanges = true;
    }
  });

  // Re-exports: export ... from 'ai', export * from 'ai'
  root.find(j.ExportNamedDeclaration).forEach(path => {
    const source = path.node.source;
    if (source && renameSource(source.value)) {
      source.value = sourceMapping[source.value as string];
      context.hasChanges = true;
    }
  });
  root.find(j.ExportAllDeclaration).forEach(path => {
    const source = path.node.source;
    if (source && renameSource(source.value)) {
      source.value = sourceMapping[source.value as string];
      context.hasChanges = true;
    }
  });

  // Dynamic import('ai')
  root
    .find(j.CallExpression)
    .filter(
      path =>
        path.node.callee.type === 'Import' &&
        path.node.arguments.length === 1 &&
        path.node.arguments[0].type === 'StringLiteral' &&
        renameSource(path.node.arguments[0].value),
    )
    .forEach(path => {
      const arg = path.node.arguments[0];
      if (arg.type === 'StringLiteral' && renameSource(arg.value)) {
        arg.value = sourceMapping[arg.value];
        context.hasChanges = true;
      }
    });

  // require('ai')
  root
    .find(j.CallExpression, {
      callee: { type: 'Identifier', name: 'require' },
    })
    .forEach(path => {
      const arg = path.node.arguments[0];
      if (
        arg &&
        (arg.type === 'StringLiteral' || arg.type === 'Literal') &&
        renameSource((arg as { value?: unknown }).value)
      ) {
        (arg as { value: string }).value =
          sourceMapping[(arg as { value: string }).value];
        context.hasChanges = true;
      }
    });
});
