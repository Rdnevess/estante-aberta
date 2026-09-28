import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { lerOpcoesTeste, urlLista, urlDetalhes, buscarJSON } from '../js/api.js';

const fetchOriginal = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

test('lerOpcoesTeste sem parâmetros não liga nada', () => {
  assert.deepEqual(lerOpcoesTeste(''), { atraso: 0, erro: '' });
});

test('lerOpcoesTeste lê atraso e erro', () => {
  assert.deepEqual(lerOpcoesTeste('?atraso=2000&erro=lista'), { atraso: 2000, erro: 'lista' });
});

test('lerOpcoesTeste ignora atraso inválido', () => {
  assert.equal(lerOpcoesTeste('?atraso=abc').atraso, 0);
  assert.equal(lerOpcoesTeste('?atraso=-5').atraso, 0);
});

test('urlLista aponta para o arquivo real ou para um inexistente', () => {
  assert.equal(urlLista(false), 'data/livros.json');
  assert.equal(urlLista(true), 'data/nao-existe.json');
});

test('urlDetalhes usa o caminho do livro ou um inexistente', () => {
  assert.equal(urlDetalhes('data/detalhes/duna.json', false), 'data/detalhes/duna.json');
  assert.equal(urlDetalhes('data/detalhes/duna.json', true), 'data/detalhes/nao-existe.json');
});

test('buscarJSON devolve o JSON quando a resposta é ok', async () => {
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => [{ id: 1 }] });
  assert.deepEqual(await buscarJSON('x.json'), [{ id: 1 }]);
});

test('buscarJSON lança erro com o status quando a resposta não é ok', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 404 });
  await assert.rejects(buscarJSON('x.json'), /404/);
});

test('buscarJSON lança erro compreensível em falha de rede', async () => {
  globalThis.fetch = async () => {
    throw new TypeError('Failed to fetch');
  };
  await assert.rejects(buscarJSON('x.json'), /conexão/);
});
