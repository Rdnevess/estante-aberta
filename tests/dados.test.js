import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizar } from '../js/filtro.js';

// "It: A Coisa" -> "it-a-coisa"
const nomeArquivo = (titulo) => normalizar(titulo).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const raiz = new URL('../', import.meta.url);
const lerJSON = (caminho) => JSON.parse(readFileSync(new URL(caminho, raiz), 'utf8'));
const livros = lerJSON('data/livros.json');
const CATEGORIAS = ['Fantasia', 'Ficção científica', 'Suspense', 'Romance', 'Terror'];

test('a listagem tem pelo menos 8 livros com os campos obrigatórios', () => {
  assert.ok(livros.length >= 8);
  for (const livro of livros) {
    for (const campo of ['id', 'titulo', 'autor', 'categoria', 'resumo', 'capa']) {
      assert.ok(livro[campo], `livro ${livro.id} sem o campo ${campo}`);
    }
    assert.equal(livro.capa, `img/capas/${nomeArquivo(livro.titulo)}.svg`);
  }
});

test('os ids são únicos', () => {
  const ids = livros.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('cada categoria prevista tem pelo menos 2 livros e não há outras', () => {
  for (const categoria of CATEGORIAS) {
    assert.ok(livros.filter((l) => l.categoria === categoria).length >= 2, categoria);
  }
  for (const livro of livros) assert.ok(CATEGORIAS.includes(livro.categoria), livro.categoria);
});

test('cada livro tem um arquivo de detalhes com informações extras', () => {
  for (const livro of livros) {
    const detalhes = lerJSON(`data/detalhes/${livro.id}.json`);
    assert.equal(detalhes.id, livro.id);
    for (const campo of ['ano', 'paginas', 'editora', 'idiomaOriginal', 'sinopse', 'autorBio']) {
      assert.ok(detalhes[campo], `detalhes ${livro.id} sem o campo ${campo}`);
    }
    assert.equal(typeof detalhes.avaliacao, 'number');
    assert.ok(Array.isArray(detalhes.curiosidades) && detalhes.curiosidades.length >= 2);
  }
});
