// Funções que montam o HTML da interface.
// Todas recebem dados e devolvem uma string de HTML; quem coloca na página é o main.js.
import { normalizar } from './filtro.js';

// Evita que textos dos dados sejam interpretados como HTML (segurança).
export function escaparHTML(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// "Ficção científica" -> "cat-ficcao-cientifica" (cores definidas em css/estilos.css)
export function classeCategoria(categoria) {
  return 'cat-' + normalizar(categoria).replaceAll(' ', '-');
}

function htmlBadge(categoria) {
  return `<span class="badge ${classeCategoria(categoria)}">${escaparHTML(categoria)}</span>`;
}

function altCapa(livro) {
  return `Capa ilustrativa de ${escaparHTML(livro.titulo)}, de ${escaparHTML(livro.autor)}`;
}

// Um card do catálogo, já dentro da coluna do grid:
// 1 coluna no celular, 2 em telas pequenas, 3 em médias/grandes, 4 em muito grandes.
// A capa também abre os detalhes (clique). Ela fica fora da ordem do Tab
// (tabindex="-1") porque o botão "Ver detalhes" já faz o mesmo pelo teclado.
export function htmlCard(livro) {
  const titulo = escaparHTML(livro.titulo);
  const id = escaparHTML(livro.id);
  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
      <article class="card h-100 livro">
        <button type="button" class="livro-capa" data-id="${id}" tabindex="-1">
          <span class="livro-capa-miolo">
            <img src="${escaparHTML(livro.capa)}" class="capa" alt="${altCapa(livro)}" width="300" height="420" loading="lazy">
          </span>
        </button>
        <div class="card-body d-flex flex-column">
          <p class="mb-2">${htmlBadge(livro.categoria)}</p>
          <h3 class="card-title h5">${titulo}</h3>
          <p class="card-subtitle text-body-secondary mb-2">${escaparHTML(livro.autor)}</p>
          <p class="card-text flex-grow-1">${escaparHTML(livro.resumo)}</p>
          <button type="button" class="btn btn-primary mt-2" data-id="${id}">
            Ver detalhes<span class="visually-hidden"> de ${titulo}</span>
          </button>
        </div>
      </article>
    </div>`;
}

// Opções do <select> de categoria.
export function htmlOpcoesCategorias(categorias) {
  const opcoes = categorias.map(
    (categoria) => `<option value="${escaparHTML(categoria)}">${escaparHTML(categoria)}</option>`,
  );
  return ['<option value="">Todas as categorias</option>', ...opcoes].join('');
}

export function textoContador(exibidos, total) {
  return `Exibindo ${exibidos} de ${total} livros`;
}

// Estado: carregando
export function htmlCarregando(mensagem) {
  return `
    <div class="d-flex align-items-center justify-content-center gap-2 py-5" role="status">
      <div class="spinner-border text-primary" aria-hidden="true"></div>
      <span>${escaparHTML(mensagem)}</span>
    </div>`;
}

// Estado: erro (com botão para tentar de novo)
export function htmlErro(mensagem) {
  return `
    <div class="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center gap-3" role="alert">
      <div class="flex-grow-1">
        <strong>Não foi possível carregar os dados.</strong><br>
        ${escaparHTML(mensagem)}
      </div>
      <button type="button" class="btn btn-danger" data-acao="tentar-novamente">Tentar novamente</button>
    </div>`;
}

// Estado: nenhum resultado para a busca/filtro
export function htmlVazio() {
  return `
    <div class="text-center py-5">
      <p class="fs-5 mb-1">Nenhum livro encontrado.</p>
      <p class="text-body-secondary">Tente outro termo de busca ou outra categoria.</p>
      <button type="button" class="btn btn-outline-primary" data-acao="limpar-filtros">Limpar filtros</button>
    </div>`;
}

// Uma crítica publicada, já dentro da coluna do grid (3 lado a lado em telas grandes):
// trecho traduzido, com o original em inglês e o link da fonte.
// "via" indica onde o trecho está reproduzido, quando não é a página do próprio veículo.
function htmlCritica(critica) {
  const assinatura = [critica.autor, critica.veiculo, critica.ano].filter(Boolean).map(escaparHTML).join(', ');
  const url = /^https:\/\//.test(critica.url) ? escaparHTML(critica.url) : '#';
  const fonte = critica.via ? `citado em ${escaparHTML(critica.via)}` : 'ler a crítica';
  return `
    <div class="col-12 col-lg-4">
    <figure class="critica h-100">
      <blockquote class="critica-trecho">
        <p>${escaparHTML(critica.trecho)}</p>
      </blockquote>
      <figcaption class="critica-fonte">
        — ${assinatura}
        · <a href="${url}" target="_blank" rel="noopener noreferrer">${fonte}<span class="visually-hidden"> (abre em nova aba)</span></a>
        <details class="critica-original">
          <summary>Original em inglês</summary>
          <p lang="en">${escaparHTML(critica.original)}</p>
        </details>
      </figcaption>
    </figure>
    </div>`;
}

// Conteúdo do modal de detalhes (dados da listagem + dados da nova requisição).
export function htmlDetalhes(livro, detalhes) {
  const curiosidades = detalhes.curiosidades
    .map((item) => `<li>${escaparHTML(item)}</li>`)
    .join('');
  const criticas = (detalhes.criticas || []).map(htmlCritica).join('');
  return `
    <div class="row g-4">
      <div class="col-12 col-md-4">
        <img src="${escaparHTML(livro.capa)}" class="capa-detalhe" alt="${altCapa(livro)}" width="300" height="420">
      </div>
      <div class="col-12 col-md-8">
        <p class="mb-1">${htmlBadge(livro.categoria)}</p>
        <p class="text-body-secondary">${escaparHTML(livro.autor)}</p>
        <dl class="row small mb-3">
          <dt class="col-6 col-sm-5">Publicação original</dt>
          <dd class="col-6 col-sm-7">${escaparHTML(detalhes.ano)}</dd>
          <dt class="col-6 col-sm-5">Páginas (aprox.)</dt>
          <dd class="col-6 col-sm-7">${escaparHTML(detalhes.paginas)}</dd>
          <dt class="col-6 col-sm-5">Editora no Brasil</dt>
          <dd class="col-6 col-sm-7">${escaparHTML(detalhes.editora)}</dd>
          <dt class="col-6 col-sm-5">Idioma original</dt>
          <dd class="col-6 col-sm-7">${escaparHTML(detalhes.idiomaOriginal)}</dd>
          <dt class="col-6 col-sm-5">Nota da Estante</dt>
          <dd class="col-6 col-sm-7">${detalhes.avaliacao.toLocaleString('pt-BR')} / 5</dd>
        </dl>
        <h3 class="h6">Sinopse</h3>
        <p>${escaparHTML(detalhes.sinopse)}</p>
        <h3 class="h6">Sobre o autor</h3>
        <p>${escaparHTML(detalhes.autorBio)}</p>
        <h3 class="h6">Curiosidades</h3>
        <ul class="mb-0">${curiosidades}</ul>
      </div>
    </div>
    ${criticas ? `
    <section class="criticas mt-4 pt-4" aria-labelledby="titulo-criticas">
      <h3 id="titulo-criticas" class="h5 mb-3">O que a crítica disse</h3>
      <div class="row g-3">${criticas}</div>
      <p class="small text-body-secondary mt-3 mb-0">Trechos traduzidos pelo projeto. As críticas originais estão em inglês.</p>
    </section>` : ''}`;
}
