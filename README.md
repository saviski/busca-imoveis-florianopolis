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

O projeto foi criado em etapas, com prompts que guiaram o Grok desde a concepção até a conclusão:

1. **Prompt Inicial**: "Crie uma listagem simples de imóveis com busca."

   - Resultado: Uma página básica com cards e busca funcional.

2. **Prompt de Refinamento**: "A descrição pode conter HTML, ajuste o `data-description`."

   - Adicionado `stripHtml` para limpar HTML na busca.

3. **Prompt de Design**: "Mova a busca para o fundo e ajuste os cards para 400-500px, centralizados."

   - Busca flutuante implementada e cards expandidos.

4. **Prompt de Funcionalidade**: "Adicione um mapa com Leaflet."

   - Mapa integrado com marcadores e legenda.

5. **Prompt de Expansão**: "Crie abas para Listagem e Mapa, e ajuste a busca para ambas."

   - Sistema de abas e busca unificada.

6. **Prompt Final**: "Adicione uma aba Imagens com galeria e divida em arquivos."
   - Aba "Imagens" adicionada, código separado em `index.html`, `styles.css`, `script.js`.

### Etapas do Processo

- **Estrutura Básica**: Criação de uma listagem com busca e suporte a HTML na descrição.
- **Melhorias de Layout**: Ajustes no tamanho dos cards, centralização e busca flutuante.
- **Integração do Mapa**: Adição de um mapa interativo com marcadores filtráveis.
- **Sistema de Abas**: Implementação de abas para "Listagem" e "Mapa", com busca unificada.
- **Galeria de Imagens**: Inclusão da aba "Imagens" com thumbnails e títulos sticky.
- **Finalização**: Separação do código em arquivos e geração de um README.

## Como Usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
