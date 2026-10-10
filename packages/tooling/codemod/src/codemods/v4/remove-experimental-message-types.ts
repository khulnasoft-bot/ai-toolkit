import type { Identifier } from 'jscodeshift';
import { createTransformer } from '../lib/create-transformer';

export default createTransformer((_fileInfo, _api, _options, context) => {
  const { j, root } = context;

  // Type mapping
  const typeMap = {
    ExperimentalMessage: 'CoreMessage',
    ExperimentalUserMessage: 'CoreUserMessage',
    ExperimentalAssistantMessage: 'CoreAssistantMessage',
    ExperimentalToolMessage: 'CoreToolMessage',
  };

  // Replace imports
  root
    .find(j.ImportSpecifier)
    .filter(path => Object.keys(typeMap).includes(path.node.imported.name))
    .forEach(path => {
      context.hasChanges = true;
      const oldName = path.node.imported.name;
      const newName = typeMap[oldName as keyof typeof typeMap];

      j(path).replaceWith(j.importSpecifier(j.identifier(newName)));
    });

  // Replace type references
  root
    .find(j.TSTypeReference)
    .filter(path => {
      const typeName = path.node.typeName;
      return (
        typeName.type === 'Identifier' && Object.hasOwn(typeMap, typeName.name)
      );
    })
    .forEach(path => {
      context.hasChanges = true;
      const typeName = path.node.typeName as Identifier;
      typeName.name = typeMap[typeName.name as keyof typeof typeMap];
    });
});
