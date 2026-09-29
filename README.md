# Estante Aberta — Catálogo de Ficção

Catálogo interativo de livros de ficção feito com HTML, CSS, JavaScript e Bootstrap 5.
Os dados são carregados por requisições AJAX (Fetch API) a partir de arquivos JSON.

- **Estudante:** Rodrigo Neves Rombaldi
- **Disciplina:** Desenvolvimento Web — UNEMAT
- **Professor:** Ivan Luiz Pedroso Pires
- **Avaliação:** Avaliação prática individual — construção de um website AJAX com Bootstrap
- **Tema:** catálogo de livros de ficção (fantasia, ficção científica, suspense, romance e terror)
- **Site publicado (GitHub Pages):** <https://rdnevess.github.io/estante-aberta/>

## Funcionalidades

- **Listagem dinâmica:** os 12 livros são carregados por AJAX de `data/livros.json`, e os cards são montados a partir dos dados recebidos.
- **Detalhes sob demanda:** ao clicar em "Ver detalhes" ou na capa do livro, uma nova requisição busca o arquivo do livro em `data/detalhes/` (ex.: `data/detalhes/duna.json`), e o resultado aparece em um modal do Bootstrap com ano, páginas, editora, sinopse, autor, curiosidades e três trechos de críticas publicadas, com link para a fonte.
- **Busca e filtro:** busca por título ou autor, sem diferenciar maiúsculas nem acentos, combinada com o filtro por categoria. Os resultados mudam sem recarregar a página.
- **Estados da interface:** indicador de carregamento, mensagem quando não há resultados e aviso de erro com botão "Tentar novamente", tanto na listagem quanto no modal.
- **Layout responsivo:** grid do Bootstrap com 1 coluna no celular, 2 em telas pequenas, 3 em médias/grandes e 4 em telas largas. Menu recolhível no celular.
- **HTML semântico e acessível:** `header`, `nav`, `main`, `section`, `article` e `footer`; títulos hierárquicos; rótulos nos campos; texto alternativo nas capas.

## Como executar

Para apenas ver o site funcionando, acesse a versão publicada: <https://rdnevess.github.io/estante-aberta/>.

Para rodar localmente, o projeto **precisa de um servidor HTTP**. Abrir o `index.html` direto (`file://`) não funciona, porque o navegador bloqueia as requisições `fetch` e os módulos JavaScript nesse modo.

**Opção 1 — Python (já vem instalado em muitos sistemas):**

```bash
cd caminho/para/o/projeto
python -m http.server 8000
```

Depois acesse <http://localhost:8000>. No Windows, se `python` não funcionar, use `py -m http.server 8000`.

**Opção 2 — VS Code:** instale a extensão **Live Server**, abra a pasta do projeto e clique em **Go Live**.

## Roteiro de teste

1. **Listagem:** abra <http://localhost:8000>. Devem aparecer 12 livros e o texto "Exibindo 12 de 12 livros". Na aba *Rede* (F12), aparece a requisição a `data/livros.json`.
2. **Detalhes:** clique em "Ver detalhes" (ou na capa) de qualquer livro. O modal abre com as informações extras e as críticas, e na aba *Rede* aparece a requisição ao arquivo do livro em `data/detalhes/` (ex.: `data/detalhes/o-hobbit.json`).
3. **Busca por texto:** digite `tolkien` (encontra *O Hobbit*) ou `fundacao`, sem acento (encontra *Fundação*).
4. **Filtro por categoria:** escolha "Terror" (2 livros). Texto e categoria podem ser combinados.
5. **Estado vazio:** digite `xyz`. Aparece "Nenhum livro encontrado." com o botão "Limpar filtros".
6. **Carregamento:** acesse <http://localhost:8000/?atraso=2000>. O indicador de carregamento aparece por 2 segundos, na listagem e ao abrir detalhes.
7. **Erro e nova tentativa (listagem):** acesse <http://localhost:8000/?erro=lista>. A primeira requisição aponta para um arquivo inexistente (erro 404) e aparece o aviso de erro. Clique em "Tentar novamente" e o catálogo carrega.
8. **Erro e nova tentativa (detalhes):** acesse <http://localhost:8000/?erro=detalhes> e clique em "Ver detalhes". O modal mostra o erro. "Tentar novamente" carrega os detalhes.
9. **Falha real de conexão (opcional):** com a página aberta, pare o servidor (Ctrl+C) e clique em "Ver detalhes". Aparece o aviso de falha de conexão.
10. **Responsividade:** no DevTools (F12 → ícone de celular), teste larguras como 375 px e 1280 px. As colunas se adaptam, o menu recolhe e não há rolagem horizontal.

> Os parâmetros `?atraso` e `?erro` existem só para demonstrar os estados. A falha simulada acontece apenas na primeira tentativa, para que o botão "Tentar novamente" mostre a recuperação.
>
> O roteiro também funciona no site publicado: basta trocar `http://localhost:8000` por `https://rdnevess.github.io/estante-aberta` (por exemplo, <https://rdnevess.github.io/estante-aberta/?erro=lista>). O item 9 é o único que só pode ser feito localmente.

## Estrutura de pastas

```
index.html                  página principal
css/estilos.css             estilos próprios
js/main.js                  ponto de entrada: estado da página e eventos
js/api.js                   requisições AJAX (fetch) e parâmetros de teste
js/filtro.js                lógica de busca e filtro
js/ui.js                    funções que montam o HTML (cards, estados, detalhes)
data/livros.json            dados da listagem
data/detalhes/{titulo}.json dados de detalhes de cada livro (ex.: o-hobbit.json)
img/capas/{titulo}.svg      capas ilustrativas (ex.: o-hobbit.svg)
ferramentas/gerar-capas.mjs script que gera as capas a partir dos dados
ferramentas/gerar-capa-inicio.mjs  script que gera a capa do topo (img/capa-inicio.svg)
```

## Fontes e créditos

- **Bootstrap 5.3.3**, carregado via CDN jsDelivr (<https://getbootstrap.com>). Licença MIT.
- **Fontes Fraunces e Newsreader**, carregadas via Google Fonts (<https://fonts.google.com>). Licença SIL Open Font License.
- **Visual:** tema escuro inspirado na Stripe Press (<https://press.stripe.com>), só como referência de estilo; nenhum código, fonte ou imagem do site foi copiado.
- **Dados dos livros:** textos (resumos, sinopses, biografias e curiosidades) escritos para este projeto a partir de informações públicas sobre as obras. Número de páginas e editoras são aproximados e se referem a edições brasileiras. A "Nota da Estante" é uma nota editorial do próprio projeto.
- **Críticas:** trechos curtos de resenhas publicadas, traduzidos para o português pelo projeto; o original em inglês aparece junto de cada trecho. Cada crítica traz o veículo e o link da fonte. Veículos: Kirkus Reviews, Publishers Weekly, The New York Times, The New York Times Book Review, NPR, Reactor (Tor.com), Common Sense Media, The New Yorker, The Washington Post Book World, Chicago Sun-Times, The A.V. Club, Entertainment Weekly, The Times Literary Supplement e, para os clássicos, resenhas de época (The British Critic, The Critical Review, Blackwood's Edinburgh Magazine, The Quarterly Review, The Edinburgh Magazine). Quando o texto do veículo não está disponível aberto, o link aponta para onde o trecho é reproduzido (páginas das editoras Penguin Random House e Simon & Schuster, The Paris Review, TIME, Jane Austen's House e o arquivo de resenhas de *Frankenstein* da Universidade da Pensilvânia), indicado como "citado em".
- **Capas:** ilustrações SVG próprias, geradas pelo script `ferramentas/gerar-capas.mjs` (uso: `node ferramentas/gerar-capas.mjs`). **Não** são as capas oficiais dos livros.
- **Logo e favicon:** símbolo SVG próprio (`img/logo.svg`), com três lombadas na prateleira nas cores das categorias.
- **Capa do topo da página:** ilustração SVG própria, gerada pelo script `ferramentas/gerar-capa-inicio.mjs` (uso: `node ferramentas/gerar-capa-inicio.mjs`).
- Não foram usadas imagens nem bibliotecas de terceiros além do Bootstrap e das fontes do Google Fonts.
