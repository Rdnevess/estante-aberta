// Gera a capa ilustrativa (SVG) do topo da página: uma estante escura com
// lombadas nas cores das capas de cada categoria e um livro aberto no centro.
// Uso: node ferramentas/gerar-capa-inicio.mjs
import { writeFileSync } from 'node:fs';

const LARGURA = 2400;
const ALTURA = 260;
const Y_PRATELEIRA = 214;

// Cores das capas de cada categoria (ferramentas/gerar-capas.mjs): [lombada, detalhe].
// O preto do Terror foi clareado para não sumir no fundo escuro.
const TONS = [
  ['#4b2a7b', '#d9b8ff'], // Fantasia
  ['#0b3d6b', '#8fd3ff'], // Ficção científica
  ['#2f4858', '#f2c14e'], // Suspense
  ['#9c2f5a', '#ffc2d6'], // Romance
  ['#3b3335', '#e04848'], // Terror
];

// Gerador pseudoaleatório com semente fixa: a capa sai igual a cada execução.
let semente = 7;
function aleatorio() {
  semente = (semente * 16807) % 2147483647;
  return (semente - 1) / 2147483646;
}
const entre = (min, max) => Math.round(min + aleatorio() * (max - min));

function lombada(x, largura, altura, [cor, detalhe]) {
  const y = Y_PRATELEIRA - altura;
  const partes = [
    `<rect x="${x}" y="${y}" width="${largura}" height="${altura}" rx="3" fill="${cor}"/>`,
    `<rect x="${x}" y="${y + 12}" width="${largura}" height="3" fill="${detalhe}" fill-opacity="0.6"/>`,
    `<rect x="${x}" y="${Y_PRATELEIRA - 16}" width="${largura}" height="3" fill="${detalhe}" fill-opacity="0.6"/>`,
  ];
  if (largura > 34) {
    partes.push(`<circle cx="${x + largura / 2}" cy="${y + altura / 2}" r="${largura / 5}" fill="${detalhe}" fill-opacity="0.3"/>`);
  }
  return partes.join('');
}

// Preenche um trecho da prateleira com lombadas de larguras e alturas variadas.
// Devolve o SVG e onde termina a última lombada.
function fileira(inicio, limite) {
  const livros = [];
  let x = inicio;
  let fim = inicio;
  while (true) {
    const largura = entre(24, 46);
    if (x + largura > limite) break;
    livros.push(lombada(x, largura, entre(112, 172), TONS[entre(0, TONS.length - 1)]));
    fim = x + largura;
    x = fim + entre(2, 5);
  }
  return { svg: livros.join('\n  '), fim };
}

// Livro inclinado, com a base logo após "encosto" e o topo apoiado nele.
// Girado 14° sobre o canto inferior direito, o canto superior esquerdo
// recua ~71 unidades: 36·cos(14°) + 150·sen(14°).
function livroInclinado(encosto) {
  const x = encosto + 72;
  return `<g transform="rotate(-14 ${x} ${Y_PRATELEIRA})">${lombada(x - 36, 36, 150, TONS[0])}</g>`;
}

// Livro aberto, visto de frente, com as páginas levemente curvadas.
function livroAberto(centro) {
  const base = Y_PRATELEIRA;
  const topo = base - 58;
  return `<g>
    <path d="M${centro - 118} ${base} L${centro} ${base + 4} L${centro + 118} ${base} L${centro + 112} ${topo + 6} L${centro} ${topo + 14} L${centro - 112} ${topo + 6} Z" fill="#9c2f5a"/>
    <path d="M${centro} ${base - 2} C${centro - 40} ${base - 12} ${centro - 80} ${base - 12} ${centro - 108} ${base - 4} L${centro - 100} ${topo} C${centro - 70} ${topo - 10} ${centro - 30} ${topo - 8} ${centro} ${topo + 8} Z" fill="#e6ddd5"/>
    <path d="M${centro} ${base - 2} C${centro + 40} ${base - 12} ${centro + 80} ${base - 12} ${centro + 108} ${base - 4} L${centro + 100} ${topo} C${centro + 70} ${topo - 10} ${centro + 30} ${topo - 8} ${centro} ${topo + 8} Z" fill="#d6cbc2"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${centro - 88} ${topo + 14 + i * 9} C${centro - 64} ${topo + 8 + i * 9} ${centro - 34} ${topo + 10 + i * 9} ${centro - 14} ${topo + 20 + i * 9}" stroke="#4b2a7b" stroke-opacity="0.18" stroke-width="2" fill="none"/>`).join('')}
    ${[0, 1, 2, 3].map((i) => `<path d="M${centro + 14} ${topo + 20 + i * 9} C${centro + 34} ${topo + 10 + i * 9} ${centro + 64} ${topo + 8 + i * 9} ${centro + 88} ${topo + 14 + i * 9}" stroke="#4b2a7b" stroke-opacity="0.18" stroke-width="2" fill="none"/>`).join('')}
    <line x1="${centro}" y1="${topo + 8}" x2="${centro}" y2="${base - 2}" stroke="#4b2a7b" stroke-opacity="0.2" stroke-width="1.5"/>
  </g>`;
}

const centro = LARGURA / 2;
const esquerda = fileira(24, centro - 192);
const direita = fileira(centro + 140, LARGURA - 24);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARGURA} ${ALTURA}" width="${LARGURA}" height="${ALTURA}">
  <rect width="${LARGURA}" height="${ALTURA}" fill="#201819"/>
  ${esquerda.svg}
  ${livroInclinado(esquerda.fim)}
  ${livroAberto(centro)}
  ${direita.svg}
  <rect x="0" y="${Y_PRATELEIRA}" width="${LARGURA}" height="14" fill="#5a4640"/>
  <rect x="0" y="${Y_PRATELEIRA + 14}" width="${LARGURA}" height="6" fill="#3e302c"/>
</svg>
`;

writeFileSync(new URL('../img/capa-inicio.svg', import.meta.url), svg, 'utf8');
console.log('Capa gerada: img/capa-inicio.svg');
