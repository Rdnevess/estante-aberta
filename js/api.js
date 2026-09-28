// Requisições AJAX com a Fetch API.

// Lê os parâmetros de teste da URL da página:
//   ?atraso=2000   -> espera 2 s antes de cada requisição (para ver o "carregando")
//   ?erro=lista    -> a primeira busca da listagem falha (para ver o erro)
//   ?erro=detalhes -> a primeira busca de detalhes falha
export function lerOpcoesTeste(search) {
  const parametros = new URLSearchParams(search);
  const atraso = Number(parametros.get('atraso'));
  return {
    atraso: Number.isFinite(atraso) && atraso > 0 ? atraso : 0,
    erro: parametros.get('erro') || '',
  };
}

// Endereços dos arquivos JSON. Para simular erro, usamos um arquivo que não existe
// (o servidor responde 404 de verdade).
export function urlLista(falhar) {
  return falhar ? 'data/nao-existe.json' : 'data/livros.json';
}

export function urlDetalhes(id, falhar) {
  return falhar ? 'data/detalhes/nao-existe.json' : `data/detalhes/${id}.json`;
}

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

// Função base: faz a requisição e devolve os dados em JSON.
// Se algo der errado, lança um erro com uma mensagem que pode ser mostrada ao usuário.
export async function buscarJSON(url, atraso = 0) {
  if (atraso > 0) await esperar(atraso);

  let resposta;
  try {
    resposta = await fetch(url);
  } catch {
    throw new Error('Falha de conexão com o servidor. Verifique se o servidor local está rodando.');
  }

  if (!resposta.ok) {
    throw new Error(`O servidor respondeu com erro ${resposta.status} ao buscar os dados.`);
  }
  return resposta.json();
}

// Opções lidas uma única vez, a partir da URL da página.
// (No Node, durante os testes, não existe "location".)
const opcoes = lerOpcoesTeste(typeof location !== 'undefined' ? location.search : '');

// A falha simulada acontece só na primeira tentativa,
// para que o botão "Tentar novamente" mostre a recuperação.
function simularErroAgora(tipo) {
  if (opcoes.erro !== tipo) return false;
  opcoes.erro = '';
  return true;
}

export function buscarLivros() {
  return buscarJSON(urlLista(simularErroAgora('lista')), opcoes.atraso);
}

export function buscarDetalhes(id) {
  return buscarJSON(urlDetalhes(id, simularErroAgora('detalhes')), opcoes.atraso);
}
