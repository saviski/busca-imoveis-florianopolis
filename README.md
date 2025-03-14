# Live version

[imoveis.saviski.web](https://imoveis.saviski.web).

# Listagem de Imóveis com Mapa e Galeria de Imagens

Este projeto é uma aplicação web interativa que exibe imóveis com uma listagem detalhada, um mapa e uma galeria de imagens, criada inteiramente no Grok, uma IA desenvolvida pela xAI. Todo o código foi gerado e refinado por meio de prompts interativos em uma única conversa, disponível aqui: [Conversa no Grok](https://grok.com/share/bGVnYWN5_41982680-4854-4db8-99f7-2fe317f0ee90).

## Sobre o Projeto

O objetivo foi construir uma interface funcional para exibir dados de imóveis a partir de um arquivo JSON (`sorted.json`), com abas para listagem, mapa e imagens, além de busca unificada. Todo o desenvolvimento, desde a estrutura inicial até os ajustes finais, foi guiado por prompts enviados ao Grok.

### Estrutura

- **`index.html`**: Contém a estrutura das abas e elementos principais.
- **`styles.css`**: Define o estilo responsivo e visual da aplicação.
- **`script.js`**: Inclui a lógica para carregar dados, gerenciar abas e interatividade.

## Funcionalidades

- **Aba "Listagem"**: Cards com informações dos imóveis (imagem, título, preço, etc.), ajustáveis entre 400-500px.
- **Aba "Mapa"**: Mapa interativo com Leaflet.js, marcadores por tipo de imóvel e legenda.
- **Aba "Imagens"**: Galeria de thumbnails com títulos fixos (sticky).
- **Busca**: Campo flutuante na parte inferior, filtrando todas as abas.
- **Dialog**: Exibe detalhes ou imagens ao clicar em cards ou marcadores.

## Desenvolvimento no Grok

O projeto evoluiu em várias etapas, detalhadas abaixo com base nos prompts fornecidos:

### Etapa 1: Entendendo a API e Configuração Inicial

- **Prompt**: "explain this api url"
  - Expliquei a URL da API do Zap Imóveis, detalhando parâmetros como `user`, `includeFields`, filtros (e.g., `bedrooms=3,2,4`, `priceMax=2000000`) e paginação (`size=15`).
- **Prompt**: "can you explain the response"
  - Descrevi a estrutura da resposta JSON, com `search.result.listings` contendo dados dos imóveis (e.g., `title`, `description`, `imageUrls`).
- **Prompt**: "help me use this api with this headers to call for more results than 15"
  - Criei um script JavaScript com `fetch`, ajustando `size` para mais resultados e usando o header `"x-domain": ".zapimoveis.com.br"`.
- **Prompt**: "lets simplify it because i am not getting any results"
  - Simplifiquei a URL, ajustando parâmetros e testando com um exemplo funcional.
- **Prompt**: "lets simplify pagination by only changing the url using string templates"
  - Refatorei para usar templates de string, alterando apenas `page` e `size`.

### Etapa 2: Extração de Dados e Filtro

- **Prompt**: "ok now i have a lot of options, can you help me select some houses based on my preferences"
  - Solicitei preferências detalhadas do usuário para filtrar os resultados.
- **Prompt**: "eu morava em uma casa na barra da lagoa..."
  - Baseado nas preferências (e.g., 3 quartos, área verde, sem norte da ilha), sugeri filtrar os 1000 elementos do JSON.
- **Prompt**: "i have filtered the results, help me pretty print the results as a new webpage"
  - Criei um script para gerar uma página HTML via Blob URL, exibindo cards com imagens (`crop/614x297`), links para Zap Imóveis e detalhes (preço, quartos, etc.).

### Etapa 3: Melhorias na Interface

- **Prompt**: "great, now when i click on the image, open a html dialog with all the images"
  - Adicionei dialogs com todas as imagens, interface em português, highlights em palavras-chave na descrição e uma barra de busca.
- **Prompt**: "just one more thing, make images lazy load since there are a ton of them"
  - Implementei `loading="lazy"` e fallback para links do YouTube usando thumbnails.
- **Prompt**: "adicione mais palavras com highlights"
  - Expandi a lista de palavras destacadas (e.g., `árvore`, `quintal`, `luz natural`).

### Etapa 4: Otimização e Mapa

- **Prompt**: "ok, going back to this code, the generated page is very slow"
  - Otimizei para 600+ elementos, removendo iframes do YouTube iniciais e ajustando a renderização.
- **Prompt**: "ótimo, agora vamos adicionar mais uma funcionalidade"
  - Adicionei um mapa flutuante com Leaflet, plotando pins via `lat` e `lon`, com dialogs ao clicar.
- **Prompt**: "mudar o mapa"
  - Refatorei para abas separadas ("Listagem" e "Mapa"), ajustando ícones por `unitTypes` e corrigindo zoom.

### Etapa 5: Correções e Refatoração

- **Prompt**: "dialog is not showing when i click on a pin"
  - Corrigi erros como `Uncaught TypeError` e travamentos, reescrevendo a lógica do mapa.
- **Prompt**: "can this code be rewritten"
  - Transformei o script em uma página HTML que carrega `sorted.json` via fetch com CORS.
- **Prompt**: "use apenas um elemento dialog"
  - Refatorei para um único `<dialog>` reutilizável.

### Etapa 6: Nova Página de Imagens

- **Prompt**: "vamos criar outra página html"
  - Criei uma página com títulos sticky, thumbnails (307x149px), busca e links para Zap Imóveis, lidando com HTML na descrição via `stripHtml`.
- **Prompt**: "faça a caixa de pesquisar ser um item flutuante"
  - Ajustei a busca para ficar flutuante na parte inferior em ambas as páginas.

### Etapa 7: Ajustes Finais

- **Prompt**: "faça os cards serem um pouquinho mais largos"
  - Aumentei os cards para 400-500px, centralizei, alinhei a descrição à esquerda e destaquei o botão "Ver Imóvel".
- **Prompt**: "agora que estou hospedando esse site"
  - Dividi o código em `index.html`, `styles.css` e `script.js`, ajustando a busca para usar `p.description`.
- **Prompt**: "faça a pagina que lista todas as imagens ser uma aba"
  - Integração da galeria como aba "Imagens", unificando tudo em um único arquivo com três abas.

### Etapa 8: Mini Mapa no Dialog

- **Prompt**: "mais uma coisa antes de finalizar, no dialog que é exibido quando se clica no card junto das fotos exibir um mapa com a localizacao do imovel o mapa deve ser pequeno, como se fosse mais uma imagem na listagem de imagens, deve aparecer por primeiro"
  - Adicionei um mini mapa (300x200px) no dialog, exibido antes das imagens, usando Leaflet com coordenadas `lat` e `lon`.
- **Prompt**: "o script dentro de loadImageGallery não esta sendo executado pois é adicionado ao innerhtml"
  - Corrigi o carregamento do mapa movendo a lógica de inicialização para fora do `innerHTML`, usando `setTimeout` após o dialog ser exibido.
- **Prompt**: "faça esse mini mapa ter display: inline-block; tamano de 600x290px o logo do leaflet e openstreetmap dentro do mapa estao ocupando muito espaco, tem como fazer eles ficarem menos visiveis? o script do mapa ainda não esta sendo executado, o mapa não é carregado dentro do dialog"
  - Ajustei o mapa para 600x290px com `display: inline-block`, reduzi a visibilidade da atribuição do OpenStreetMap (fonte 8px, opacidade 0.5), e corrigi o carregamento com um `setTimeout` mais robusto após `showModal()`.
- **Prompt**: "no mobile o mapa acaba ficando muito grande, entao ajustar o minimapa para não ser maior do que o espaço disponivel"
  - Tornei o mini mapa responsivo com `max-width: 100%` e `aspect-ratio: 600 / 290` em mobile (telas < 768px), ajustando a altura proporcionalmente e usando `map.invalidateSize()` para corrigir a renderização.

### Etapas do Processo

- **Estrutura Básica**: Criação de uma listagem com busca e suporte a HTML na descrição.
- **Melhorias de Layout**: Ajustes no tamanho dos cards, centralização e busca flutuante.
- **Integração do Mapa**: Adição de um mapa interativo com marcadores filtráveis.
- **Sistema de Abas**: Implementação de abas para "Listagem" e "Mapa", com busca unificada.
- **Galeria de Imagens**: Inclusão da aba "Imagens" com thumbnails e títulos sticky.
- **Finalização**: Separação do código em arquivos e geração de um README.

### Créditos

Desenvolvido inteiramente no Grok (xAI). Veja o processo detalhado: [Conversa no Grok](https://grok.com/share/bGVnYWN5_41982680-4854-4db8-99f7-2fe317f0ee90).
