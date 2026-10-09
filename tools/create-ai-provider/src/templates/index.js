import * as fullCustom from './full-custom.js';
import * as harnessAcp from './harness-acp.js';
import * as openaiCompatible from './openai-compatible.js';

const registry = {
  [openaiCompatible.name]: openaiCompatible,
  [harnessAcp.name]: harnessAcp,
  [fullCustom.name]: fullCustom,
};

export function getArchetype(name) {
  return registry[name] || registry['openai-compatible'];
}

export function getAllArchetypes() {
  return Object.values(registry).map(({ name, description }) => ({
    name,
    description,
  }));
}
