# Estante Aberta — Catálogo de Ficção

Catálogo interativo de livros de ficção feito com HTML, CSS, JavaScript e Bootstrap 5.
Os dados são carregados por requisições AJAX (Fetch API) a partir de arquivos JSON.

- **Estudante:** Rodrigo Neves Rombaldi
- **Disciplina:** Desenvolvimento Web — UNEMAT
- **Professor:** Ivan Luiz Pedroso Pires
- **Avaliação:** Avaliação prática individual — construção de um website AJAX com Bootstrap
- **Tema:** catálogo de livros de ficção (fantasia, ficção científica, suspense, romance e terror)

## Funcionalidades

- **Listagem dinâmica:** os 12 livros são carregados por AJAX de `data/livros.json`, e os cards são montados a partir dos dados recebidos.
- **Detalhes sob demanda:** ao clicar em "Ver detalhes", uma nova requisição busca `data/detalhes/{id}.json`, e o resultado aparece em um modal do Bootstrap com ano, páginas, editora, sinopse, autor e curiosidades.
- **Busca e filtro:** busca por título ou autor, sem diferenciar maiúsculas nem acentos, combinada com o filtro por categoria. Os resultados mudam sem recarregar a página.
- **Estados da interface:** indicador de carregamento, mensagem quando não há resultados e aviso de erro com botão "Tentar novamente", tanto na listagem quanto no modal.
- **Layout responsivo:** grid do Bootstrap com 1 coluna no celular, 2 em telas pequenas, 3 em médias/grandes e 4 em telas largas. Menu recolhível no celular.
- **HTML semântico e acessível:** `header`, `nav`, `main`, `section`, `article` e `footer`; títulos hierárquicos; rótulos nos campos; texto alternativo nas capas.

## Como executar

O projeto **precisa de um servidor HTTP**. Abrir o `index.html` direto (`file://`) não funciona, porque o navegador bloqueia as requisições `fetch` e os módulos JavaScript nesse modo.

**Opção 1 — Python (já vem instalado em muitos sistemas):**

```bash
cd caminho/para/o/projeto
python -m http.server 8000
```

Depois acesse <http://localhost:8000>. No Windows, se `python` não funcionar, use `py -m http.server 8000`.

**Opção 2 — VS Code:** instale a extensão **Live Server**, abra a pasta do projeto e clique em **Go Live**.

## Roteiro de teste

1. **Listagem:** abra <http://localhost:8000>. Devem aparecer 12 livros e o texto "Exibindo 12 de 12 livros". Na aba *Rede* (F12), aparece a requisição a `data/livros.json`.
2. **Detalhes:** clique em "Ver detalhes" de qualquer livro. O modal abre com as informações extras, e na aba *Rede* aparece a requisição a `data/detalhes/{id}.json`.
3. **Busca por texto:** digite `tolkien` (encontra *O Hobbit*) ou `fundacao`, sem acento (encontra *Fundação*).
4. **Filtro por categoria:** escolha "Terror" (2 livros). Texto e categoria podem ser combinados.
5. **Estado vazio:** digite `xyz`. Aparece "Nenhum livro encontrado." com o botão "Limpar filtros".
6. **Carregamento:** acesse <http://localhost:8000/?atraso=2000>. O indicador de carregamento aparece por 2 segundos, na listagem e ao abrir detalhes.
7. **Erro e nova tentativa (listagem):** acesse <http://localhost:8000/?erro=lista>. A primeira requisição aponta para um arquivo inexistente (erro 404) e aparece o aviso de erro. Clique em "Tentar novamente" e o catálogo carrega.
8. **Erro e nova tentativa (detalhes):** acesse <http://localhost:8000/?erro=detalhes> e clique em "Ver detalhes". O modal mostra o erro. "Tentar novamente" carrega os detalhes.
9. **Falha real de conexão (opcional):** com a página aberta, pare o servidor (Ctrl+C) e clique em "Ver detalhes". Aparece o aviso de falha de conexão.
10. **Responsividade:** no DevTools (F12 → ícone de celular), teste larguras como 375 px e 1280 px. As colunas se adaptam, o menu recolhe e não há rolagem horizontal.

> Os parâmetros `?atraso` e `?erro` existem só para demonstrar os estados. A falha simulada acontece apenas na primeira tentativa, para que o botão "Tentar novamente" mostre a recuperação.

## Estrutura de pastas

```
index.html                 página principal
css/estilos.css            estilos próprios
js/main.js                 ponto de entrada: estado da página e eventos
js/api.js                  requisições AJAX (fetch) e parâmetros de teste
js/filtro.js               lógica de busca e filtro
js/ui.js                   funções que montam o HTML (cards, estados, detalhes)
data/livros.json           dados da listagem
data/detalhes/{id}.json    dados de detalhes de cada livro
img/capas/{titulo}.svg     capas ilustrativas (ex.: o-hobbit.svg)
ferramentas/gerar-capas.js script que gera as capas a partir dos dados
tests/                     testes automatizados (Node)
```

## Testes automatizados (opcional)

Com Node.js 20 ou superior instalado:

```bash
npm test
```

Os testes verificam a lógica de busca e filtro, as funções de requisição, a montagem do HTML e a integridade dos arquivos de dados e das capas.

## Fontes e créditos

- **Bootstrap 5.3.3**, carregado via CDN jsDelivr (<https://getbootstrap.com>). Licença MIT.
- **Dados dos livros:** textos (resumos, sinopses, biografias e curiosidades) escritos para este projeto a partir de informações públicas sobre as obras. Número de páginas e editoras são aproximados e se referem a edições brasileiras. A "Nota da Estante" é uma nota editorial do próprio projeto.
- **Capas:** ilustrações SVG próprias, geradas pelo script `ferramentas/gerar-capas.js`. **Não** são as capas oficiais dos livros.
- Não foram usadas imagens nem bibliotecas de terceiros além do Bootstrap.
