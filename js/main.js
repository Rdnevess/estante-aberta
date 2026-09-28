// Ponto de entrada da página: guarda o estado e liga os eventos aos elementos.
import { buscarLivros, buscarDetalhes } from './api.js';
import { filtrarLivros, listarCategorias } from './filtro.js';
import {
  htmlCard, htmlOpcoesCategorias, textoContador,
  htmlCarregando, htmlErro, htmlVazio, htmlDetalhes,
} from './ui.js';

// Elementos da página
const formBusca = document.querySelector('#form-busca');
const camposBusca = document.querySelector('#campos-busca');
const campoTexto = document.querySelector('#busca-texto');
const campoCategoria = document.querySelector('#busca-categoria');
const botaoLimpar = document.querySelector('#btn-limpar');
const contador = document.querySelector('#contador');
const areaEstado = document.querySelector('#area-estado');
const listaLivros = document.querySelector('#lista-livros');
const menu = document.querySelector('#menu');
const modalTitulo = document.querySelector('#modal-detalhes-titulo');
const modalCorpo = document.querySelector('#modal-detalhes-corpo');
const modal = new bootstrap.Modal('#modal-detalhes');

// Estado da aplicação
let livros = []; // lista recebida da requisição
let ultimoIdSolicitado = null; // livro cujo detalhe está sendo exibido

// 1) Listagem: busca os livros e monta o catálogo
async function carregarCatalogo() {
  camposBusca.disabled = true;
  listaLivros.innerHTML = '';
  contador.textContent = '';
  areaEstado.innerHTML = htmlCarregando('Carregando catálogo…');

  try {
    livros = await buscarLivros();
    campoCategoria.innerHTML = htmlOpcoesCategorias(listarCategorias(livros));
    camposBusca.disabled = false;
    atualizarLista();
  } catch (erro) {
    areaEstado.innerHTML = htmlErro(erro.message);
  }
}

// 2) Busca/filtro: usa os dados já carregados, sem nova requisição
function atualizarLista() {
  const filtrados = filtrarLivros(livros, campoTexto.value, campoCategoria.value);
  contador.textContent = textoContador(filtrados.length, livros.length);
  listaLivros.innerHTML = filtrados.map(htmlCard).join('');
  areaEstado.innerHTML = filtrados.length === 0 ? htmlVazio() : '';
}

function limparFiltros() {
  campoTexto.value = '';
  campoCategoria.value = '';
  atualizarLista();
  campoTexto.focus();
}

// 3) Detalhes: nova requisição AJAX para o livro escolhido
async function abrirDetalhes(id) {
  const livro = livros.find((item) => String(item.id) === String(id));
  if (!livro) return;

  ultimoIdSolicitado = livro.id;
  modalTitulo.textContent = livro.titulo;
  modalCorpo.innerHTML = htmlCarregando('Carregando detalhes…');
  modal.show();

  try {
    const detalhes = await buscarDetalhes(livro.id);
    // Se o usuário já abriu outro livro enquanto esperava, ignora esta resposta.
    if (livro.id !== ultimoIdSolicitado) return;
    modalCorpo.innerHTML = htmlDetalhes(livro, detalhes);
  } catch (erro) {
    if (livro.id !== ultimoIdSolicitado) return;
    modalCorpo.innerHTML = htmlErro(erro.message);
  }
}

// Eventos do formulário
formBusca.addEventListener('submit', (evento) => evento.preventDefault()); // Enter não recarrega a página
campoTexto.addEventListener('input', atualizarLista);
campoCategoria.addEventListener('change', atualizarLista);
botaoLimpar.addEventListener('click', limparFiltros);

// Delegação de eventos: um único ouvinte atende aos botões criados dinamicamente
listaLivros.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button[data-id]');
  if (botao) abrirDetalhes(botao.dataset.id);
});

areaEstado.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-acao]');
  if (!botao) return;
  if (botao.dataset.acao === 'tentar-novamente') carregarCatalogo();
  if (botao.dataset.acao === 'limpar-filtros') limparFiltros();
});

modalCorpo.addEventListener('click', (evento) => {
  if (evento.target.closest('[data-acao="tentar-novamente"]')) abrirDetalhes(ultimoIdSolicitado);
});

// No celular, fecha o menu depois de clicar em um link
menu.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
  });
});

carregarCatalogo();
