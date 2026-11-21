# Clínica Aura · Estética integrada

Projeto conceitual de portfólio. Clínica, profissionais, contatos e localização são fictícios.

Site estático (HTML, CSS e JavaScript, sem dependências). Publicado em https://clinicaauraestetica.vercel.app/.

## Versão 7 · quiet luxury

Redesenho da v6 seguindo a skill **quiet-luxury** (pacote design-taste) e revisado com as skills **taste-design-review**, **taste-accessibility** e **taste-code-review**.

- **Paleta**: marfim `#F7F2EA`, painel `#EFE8DC`, tinta espresso `#17130F`, texto `#6E655A` e um único acento, o vinho da marca `#5B2438`. Sem branco puro, sem gradientes.
- **Tipografia**: Cormorant Garamond nos títulos (itálico em uma palavra por título) e Manrope no texto; rótulos em caixa alta espaçada.
- **Composição**: linhas finas no lugar de cartões, colunas editoriais assimétricas, seções com 112 a 184 px de respiro, fotos dessaturadas com margens.
- **Seções**: abertura com índice (Pele, Rosto, Corpo, Bem-estar), A casa (manifesto e fatos), Seu caminho (guia de duas escolhas que monta a mensagem de WhatsApp), Protocolos, Como começa, Dúvidas e Fecho.
- **Um botão preenchido por tela**; as demais ações são links discretos. No celular, uma barra fina de conversa aparece fora das áreas que já têm botão.
- Movimento mínimo: uma entrada suave por bloco (12 px, 650 ms) e `prefers-reduced-motion`.

## WhatsApp

Como o projeto é fictício, os botões abrem uma simulação com a mensagem pronta. Para um cliente real, preencha `WHATSAPP_NUMBER` no início de `script.js` (ex.: `'5565999999999'`) e os botões passam a abrir o `wa.me` com a mensagem montada.

## Detalhes técnicos

- Fontes via Google Fonts (Cormorant Garamond e Manrope).
- Imagens locais em `assets/` (WebP, origem Unsplash), em vez de links externos.
- Navegação por teclado, foco visível, `prefers-reduced-motion`, rótulos acessíveis.
- SEO: título, descrição, canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml`.
