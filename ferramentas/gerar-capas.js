// Gera as capas ilustrativas (SVG) de cada livro a partir de data/livros.json.
// Uso: node ferramentas/gerar-capas.js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const raiz = new URL('../', import.meta.url);
const livros = JSON.parse(readFileSync(new URL('data/livros.json', raiz), 'utf8'));

// Cores por categoria: [fundo, destaque]
const CORES = {
  'Fantasia': ['#4b2a7b', '#d9b8ff'],
  'Ficção científica': ['#0b3d6b', '#8fd3ff'],
  'Suspense': ['#2f4858', '#f2c14e'],
  'Romance': ['#9c2f5a', '#ffc2d6'],
  'Terror': ['#1f1f1f', '#e04848'],
};

function escaparXML(texto) {
  return texto.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// Quebra o título em linhas de no máximo "max" caracteres, sem cortar palavras.
function quebrarLinhas(texto, max) {
  const linhas = [];
  let atual = '';
  for (const palavra of texto.split(' ')) {
    if (atual && (atual + ' ' + palavra).length > max) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = atual ? atual + ' ' + palavra : palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

function gerarSVG(livro) {
  const [fundo, destaque] = CORES[livro.categoria];
  const linhas = quebrarLinhas(livro.titulo, 14);
  const alturaLinha = 38;
  const yInicial = 250 - ((linhas.length - 1) * alturaLinha) / 2;
  const titulo = linhas
    .map((linha, i) => `<tspan x="150" y="${yInicial + i * alturaLinha}">${escaparXML(linha)}</tspan>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" width="300" height="420">
  <rect width="300" height="420" fill="${fundo}"/>
  <rect x="16" y="16" width="268" height="388" fill="none" stroke="${destaque}" stroke-opacity="0.6" stroke-width="2"/>
  <circle cx="150" cy="120" r="56" fill="${destaque}" fill-opacity="0.18"/>
  <circle cx="150" cy="120" r="30" fill="${destaque}" fill-opacity="0.35"/>
  <text text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-weight="bold" fill="#ffffff">${titulo}</text>
  <line x1="110" y1="335" x2="190" y2="335" stroke="${destaque}" stroke-width="2"/>
  <text x="150" y="368" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="${destaque}">${escaparXML(livro.autor)}</text>
</svg>
`;
}

mkdirSync(new URL('img/capas/', raiz), { recursive: true });
for (const livro of livros) {
  writeFileSync(new URL(livro.capa, raiz), gerarSVG(livro), 'utf8');
  console.log('Capa gerada:', livro.capa);
}
