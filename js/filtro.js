// Funções de busca e filtro do catálogo.
// Não usam o DOM, por isso podem ser testadas no Node (pasta tests/).

// Deixa o texto em minúsculas e sem acentos: "Ficção" -> "ficcao"
export function normalizar(texto) {
  return String(texto)
    .normalize('NFD') // separa letras e acentos
    .replace(/[̀-ͯ]/g, '') // remove os acentos
    .toLowerCase()
    .trim();
}

// Retorna os livros cujo título OU autor contém o texto
// E que pertencem à categoria escolhida ("" = todas).
export function filtrarLivros(livros, texto, categoria) {
  const termo = normalizar(texto);
  return livros.filter((livro) => {
    const bateTexto =
      termo === '' ||
      normalizar(livro.titulo).includes(termo) ||
      normalizar(livro.autor).includes(termo);
    const bateCategoria = categoria === '' || livro.categoria === categoria;
    return bateTexto && bateCategoria;
  });
}

// Lista das categorias existentes nos dados, sem repetição e em ordem alfabética.
export function listarCategorias(livros) {
  const unicas = new Set(livros.map((livro) => livro.categoria));
  return [...unicas].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
