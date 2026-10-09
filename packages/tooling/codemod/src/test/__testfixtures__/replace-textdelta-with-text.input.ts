// @ts-nocheck
// Test file for replace-textdelta-with-text codemod

// 1. Member expression cases
const _content = delta.textDelta; // Should be transformed
const _otherContent = delta.text; // Should NOT be transformed
const _wrongObject = other.textDelta; // Should NOT be transformed (wrong object)
const _wrongProperty = delta.otherProperty; // Should NOT be transformed (wrong property)

// 1.1. Destructuring cases
const { textDelta } = delta; // Should be transformed
const { text: existingText } = delta; // Should NOT be transformed
const { textDelta: renamedDelta } = delta; // Should be transformed
const { text: renamedText } = delta; // Should NOT be transformed
const { textDelta: deltaContent, otherProp } = delta; // Should transform textDelta only
const { text: textContent, anotherProp } = delta; // Should NOT be transformed
const { wrongProp } = other; // Should NOT be transformed (wrong object)

// Function parameter destructuring
function _processTextDelta({ textDelta }: any) {
  // Should be transformed
  return textDelta;
}
function _processText({ text }: any) {
  // Should NOT be transformed
  return text;
}

// Nested destructuring
const {
  data: { textDelta: nestedTextDelta },
} = someObject; // Should NOT be transformed (not direct delta destructuring)
const {
  delta: { textDelta: deepTextDelta },
} = someObject; // Should NOT be transformed (not direct delta destructuring)
