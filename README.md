# Clínica Aura · Estética integrada

Projeto conceitual de portfólio. Clínica, profissionais, contatos e localização são fictícios.

Site estático (HTML, CSS e JavaScript, sem dependências). Publicado em https://clinicaauraestetica.vercel.app/.

## Versão 8 · reboot quiet luxury, faixa Estratégico

Reboot completo (cores, fontes, imagens e arquitetura). A Aura está na faixa **Estratégico** do portfólio: landing sob medida, narrativa própria e interações autorais. Skills usadas: **quiet-luxury** e **design-taste** para o desenho; **taste-design-review**, **taste-accessibility** e **taste-code-review** para a revisão.

- **Conceito**: uma "casa de estética" em quatro tempos (Escuta, Leitura, Ritual, Continuidade). A consulta do site termina numa carta escrita para a pessoa.
- **Paleta**: linho `#F4EEE6`, painel `#EAE1D5`, tinta `#1E1915`, texto `#685D53` e um único acento, o latão `#8A6A3E` (com `#755A33` para texto pequeno). Fecho em tinta escura. Sem branco puro, sem gradientes.
- **Tipografia**: Bodoni Moda nos títulos (uma palavra em itálico por título) e Jost no texto, com rótulos em caixa alta espaçada.
- **Arquitetura**: abertura com retrato em passe-partout · A casa (manifesto e fatos) · Os quatro tempos (lista com imagem fixa que troca conforme a rolagem) · A consulta (três perguntas, uma por vez, que geram a carta e a mensagem de WhatsApp) · Rituais (o sugerido é destacado) · Dúvidas · Fecho.
- **Interações**: a consulta avança ao escolher, aceita teclado (setas e Enter), lembra a carta ao recarregar e pode ser refeita. Um botão preenchido por tela; no celular, uma barra discreta de conversa aparece fora das áreas com botão.
- **Movimento**: subida de 12 px com `cubic-bezier(.22,1,.36,1)` e respeito a `prefers-reduced-motion`.

### Créditos das imagens (Unsplash)

IDs: 1675773051474 (abertura), 1759507058804 (a casa), 1752245818739, 1643684391140, 1761718210089, 1763264683444 (quatro tempos), 1585945037805, 1554151228, 1755770355297 (rituais), 1781344116880 (carta). As pedras quentes vêm da versão anterior.

## WhatsApp

Como o projeto é fictício, os botões abrem uma simulação com a mensagem pronta. Para um cliente real, preencha `WHATSAPP_NUMBER` no início de `script.js` (ex.: `'5565999999999'`) e os botões passam a abrir o `wa.me` com a mensagem montada.

## Detalhes técnicos

- Fontes via Google Fonts (Bodoni Moda e Jost).
- Imagens locais em `assets/` (WebP, origem Unsplash), em vez de links externos.
- Navegação por teclado, foco visível, `prefers-reduced-motion`, rótulos acessíveis.
- SEO: título, descrição, canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml`.
