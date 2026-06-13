import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const componentPath = new URL('../src/谍影迷梦/界面/状态栏/components/CharacterRoster.vue', import.meta.url);
const component = fs.readFileSync(componentPath, 'utf8');
const script = component.match(/<script setup lang="ts">([\s\S]*?)<\/script>/)?.[1];

assert.ok(script, 'CharacterRoster.vue must contain a TypeScript setup script');

const source = ts.createSourceFile('CharacterRoster.ts', script, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

function findCharactersInitializer() {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;

    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === 'characters') {
        return declaration.initializer;
      }
    }
  }

  return undefined;
}

function unwrapExpression(expression) {
  while (ts.isParenthesizedExpression(expression)) expression = expression.expression;
  return expression;
}

test('character cards bind every entry to the current MVU store data', () => {
  const initializer = findCharactersInitializer();

  assert.ok(
    initializer && ts.isCallExpression(initializer) && ts.isIdentifier(initializer.expression),
    'characters must be created with computed() so replaced MVU data stays reactive',
  );
  assert.equal(initializer.expression.text, 'computed');

  const factory = initializer.arguments[0];
  assert.ok(factory && ts.isArrowFunction(factory), 'computed() must receive a character-list factory');

  const array = unwrapExpression(factory.body);
  assert.ok(ts.isArrayLiteralExpression(array), 'the character-list factory must return an array');
  assert.equal(array.elements.length, 8);

  for (const element of array.elements) {
    assert.ok(ts.isObjectLiteralExpression(element));

    const properties = new Map(
      element.properties
        .filter(ts.isPropertyAssignment)
        .map(property => [property.name.getText(source).replaceAll("'", ''), property.initializer]),
    );
    const key = properties.get('key');
    const data = properties.get('data');

    assert.ok(key && ts.isStringLiteral(key));
    assert.ok(data && ts.isPropertyAccessExpression(data), `${key.text} is missing its MVU data binding`);
    assert.equal(data.getText(source), `store.data.${key.text}`);
  }
});
