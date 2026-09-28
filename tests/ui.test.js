import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  escaparHTML, classeCategoria, htmlCard, htmlOpcoesCategorias, textoContador,
  htmlCarregando, htmlErro, htmlVazio, htmlDetalhes,
} from '../js/ui.js';

const duna = {
  id: 4, titulo: 'Duna', autor: 'Frank Herbert', categoria: 'Ficção científica',
  resumo: 'Um planeta desértico.', capa: 'img/capas/4.svg',
};

const detalhesDuna = {
  id: 4, ano: 1965, paginas: 680, editora: 'Aleph', idiomaOriginal: 'Inglês',
  sinopse: 'A Casa Atreides recebe Arrakis.', avaliacao: 4.6,
  curiosidades: ['Venceu o Nebula.', 'Publicado pela Chilton.'], autorBio: 'Jornalista.',
};

test('escaparHTML troca caracteres especiais', () => {
  assert.equal(escaparHTML(`<b>"x" & 'y'</b>`), '&lt;b&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/b&gt;');
});

test('classeCategoria gera classe CSS sem acentos', () => {
  assert.equal(classeCategoria('Ficção científica'), 'cat-ficcao-cientifica');
  assert.equal(classeCategoria('Terror'), 'cat-terror');
});

test('htmlCard contém título, alt descritivo, h3 e botão com data-id', () => {
  const html = htmlCard(duna);
  assert.match(html, /<article class="card/);
  assert.match(html, /<h3[^>]*>Duna<\/h3>/);
  assert.match(html, /alt="Capa ilustrativa de Duna, de Frank Herbert"/);
  assert.match(html, /data-id="4"/);
  assert.match(html, /cat-ficcao-cientifica/);
});

test('htmlCard escapa HTML vindo dos dados', () => {
  const html = htmlCard({ ...duna, titulo: '<script>alert(1)</script>' });
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

test('htmlOpcoesCategorias começa com "Todas as categorias"', () => {
  assert.equal(
    htmlOpcoesCategorias(['Fantasia', 'Terror']),
    '<option value="">Todas as categorias</option><option value="Fantasia">Fantasia</option><option value="Terror">Terror</option>',
  );
});

test('textoContador descreve quantos livros aparecem', () => {
  assert.equal(textoContador(3, 12), 'Exibindo 3 de 12 livros');
});

test('htmlCarregando tem spinner e role status', () => {
  const html = htmlCarregando('Carregando catálogo…');
  assert.match(html, /spinner-border/);
  assert.match(html, /role="status"/);
  assert.match(html, /Carregando catálogo…/);
});

test('htmlErro mostra a mensagem e o botão de tentar novamente', () => {
  const html = htmlErro('Erro 404');
  assert.match(html, /role="alert"/);
  assert.match(html, /Erro 404/);
  assert.match(html, /data-acao="tentar-novamente"/);
});

test('htmlVazio oferece limpar filtros', () => {
  assert.match(htmlVazio(), /data-acao="limpar-filtros"/);
});

test('htmlDetalhes mostra dados extras, curiosidades e nota com vírgula', () => {
  const html = htmlDetalhes(duna, detalhesDuna);
  assert.match(html, /1965/);
  assert.match(html, /Aleph/);
  assert.match(html, /A Casa Atreides recebe Arrakis\./);
  assert.match(html, /<li>Venceu o Nebula\.<\/li>/);
  assert.match(html, /<li>Publicado pela Chilton\.<\/li>/);
  assert.match(html, /4,6/);
});
