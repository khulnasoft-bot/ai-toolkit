// @ts-nocheck
import type { IdGenerator } from 'ai';

// Variable declarations with type annotations
const generator1: IdGenerator = createGenerator();
let generator2: IdGenerator;
var _generator3: IdGenerator = null;

// Function declarations with IDGenerator parameters
function _processGenerator(gen: IdGenerator): void {
  console.log(gen);
}

// Arrow functions with IDGenerator parameters
const _handleGenerator = (gen: IdGenerator): IdGenerator => {
  return gen;
};

// Function return types
function _createCustomGenerator(): IdGenerator {
  return {} as IdGenerator;
}

// Type aliases and interfaces
type MyGenerator = IdGenerator;
interface GeneratorConfig {
  generator: IdGenerator;
}

// Class properties
class GeneratorService {
  private generator: IdGenerator;

  constructor(gen: IdGenerator) {
    this.generator = gen;
  }

  getGenerator(): IdGenerator {
    return this.generator;
  }
}

// Generic types
type GeneratorArray = Array<IdGenerator>;
type GeneratorMap = Map<string, IdGenerator>;

// Object type annotations
const _config: {
  primary: IdGenerator;
  secondary?: IdGenerator;
} = {
  primary: generator1,
  secondary: generator2,
};

// Should NOT be transformed - different package
import type { IDGenerator as OtherGenerator } from 'other-package';

const _otherGen: OtherGenerator = null;
