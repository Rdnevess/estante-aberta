import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizar, filtrarLivros, listarCategorias } from '../js/filtro.js';

const livros = [
  { id: 1, titulo: 'Duna', autor: 'Frank Herbert', categoria: 'Ficção científica' },
  { id: 2, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', categoria: 'Fantasia' },
  { id: 3, titulo: 'Fundação', autor: 'Isaac Asimov', categoria: 'Ficção científica' },
];

test('normalizar remove acentos, espaços das pontas e maiúsculas', () => {
  assert.equal(normalizar('  Ficção CIENTÍFICA '), 'ficcao cientifica');
});

test('filtrarLivros sem texto e sem categoria retorna todos', () => {
  assert.equal(filtrarLivros(livros, '', '').length, 3);
});

test('filtrarLivros busca no título ignorando acentos', () => {
  assert.deepEqual(filtrarLivros(livros, 'fundacao', '').map((l) => l.id), [3]);
});

test('filtrarLivros busca no autor', () => {
  assert.deepEqual(filtrarLivros(livros, 'TOLKIEN', '').map((l) => l.id), [2]);
});

test('filtrarLivros filtra só pela categoria', () => {
  assert.deepEqual(filtrarLivros(livros, '', 'Fantasia').map((l) => l.id), [2]);
});

test('filtrarLivros combina texto e categoria', () => {
  assert.deepEqual(filtrarLivros(livros, 'asimov', 'Ficção científica').map((l) => l.id), [3]);
  assert.deepEqual(filtrarLivros(livros, 'asimov', 'Fantasia'), []);
});

test('filtrarLivros retorna lista vazia quando nada bate', () => {
  assert.deepEqual(filtrarLivros(livros, 'xyz', ''), []);
});

test('listarCategorias remove repetições e ordena', () => {
  assert.deepEqual(listarCategorias(livros), ['Fantasia', 'Ficção científica']);
});
