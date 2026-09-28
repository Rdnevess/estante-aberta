import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const raiz = new URL('../', import.meta.url);
const livros = JSON.parse(readFileSync(new URL('data/livros.json', raiz), 'utf8'));

test('cada livro tem sua capa SVG com o título', () => {
  for (const livro of livros) {
    const arquivo = new URL(livro.capa, raiz);
    assert.ok(existsSync(arquivo), `capa ausente: ${livro.capa}`);
    const svg = readFileSync(arquivo, 'utf8');
    assert.match(svg, /^<svg /);
    assert.match(svg, /viewBox="0 0 300 420"/);
    assert.ok(svg.includes(livro.autor), `capa ${livro.id} sem o autor`);
  }
});
