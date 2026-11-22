# Clínica Aura · Estética integrada

Projeto conceitual de portfólio. Clínica, profissionais, contatos e localização são fictícios.

Site estático (HTML, CSS e JavaScript, sem dependências). Publicado em https://clinicaauraestetica.vercel.app/.

## Versão 8 · reboot quiet luxury, faixa Estratégico

Reboot completo (cores, fontes, imagens e arquitetura). A Aura está na faixa **Estratégico** do portfólio: landing sob medida, narrativa própria e interações autorais. Skills usadas: **quiet-luxury** e **design-taste** para o desenho; **taste-design-review**, **taste-accessibility** e **taste-code-review** para a revisão.

- **Conceito**: uma "casa de estética" em quatro tempos (Escuta, Leitura, Ritual, Continuidade). A consulta do site termina numa carta escrita para a pessoa.
- **Paleta**: linho `#F4EEE6`, painel `#EAE1D5`, tinta `#1E1915`, texto `#685D53` e um único acento, o latão `#8A6A3E` (com `#755A33` para texto pequeno). Fecho em tinta escura. Sem branco puro, sem gradientes.
- **Tipografia**: Newsreader nos títulos, fixada no corte óptico 24 para ter hastes e curvas firmes (a Bodoni anterior ficava fina demais), com uma palavra em itálico por título, e Jost no texto. Fontes servidas do próprio site, só latim, pesos 400 e 500.
- **Arquitetura**: abertura com retrato em passe-partout · A casa (manifesto e fatos) · Os quatro tempos (lista com imagem fixa que troca conforme a rolagem) · A consulta (três perguntas, uma por vez, que geram a carta e a mensagem de WhatsApp) · Rituais (o sugerido é destacado) · Dúvidas · Fecho.
- **Interações**: a consulta avança ao escolher, aceita teclado (setas e Enter), lembra a carta ao recarregar e pode ser refeita. Um botão preenchido por tela; no celular, uma barra discreta de conversa aparece fora das áreas com botão.
- **Movimento** (taste-motion, taste-gsap e um toque de cinematic-motion, revisado com animate e review-animations): GSAP + ScrollTrigger servidos localmente em `assets/vendor/`, tudo dentro de `gsap.matchMedia`. A abertura é uma sequência única de menos de 1,5 s. Os títulos sobem palavra por palavra atrás de uma máscara, e as fotos abrem como cortina. Os números dos compromissos contam ao aparecer. No desktop há paralaxe leve, um trilho que se preenche nos quatro tempos e um botão principal com leve atração magnética; uma linha de progresso de leitura acompanha o cabeçalho. Sem JS ou com movimento reduzido, a página fica completa e parada.
- **Conversão** (taste-landing-page e taste-ux-copy): a abertura diz o que é, para quem é e o que fazer. A faixa de compromissos (60 minutos, 1 pessoa por vez, retorno em 15 dias) traz prova logo abaixo, e o mesmo botão "Começar minha consulta" abre e fecha a página, com "Falar pelo WhatsApp" como ação secundária em todo lugar.
- **Desempenho** (taste-web-performance): imagens com `srcset` de 720 px, fontes recortadas (de 222 KB para 75 KB), sem recursos de terceiros. Lighthouse móvel em servidor local sem compressão: desempenho 0,92 a 0,93, acessibilidade, boas práticas e SEO 1,0, CLS ≤ 0,023, cerca de 300 KB na primeira carga.

### Créditos das imagens (Unsplash)

IDs: 1675773051474 (abertura), 1759507058804 (a casa), 1752245818739, 1643684391140, 1761718210089, 1763264683444 (quatro tempos), 1585945037805, 1554151228, 1755770355297 (rituais), 1781344116880 (carta). As pedras quentes vêm da versão anterior.

## WhatsApp

Como o projeto é fictício, os botões abrem uma simulação com a mensagem pronta. Para um cliente real, preencha `WHATSAPP_NUMBER` no início de `script.js` (ex.: `'5565999999999'`) e os botões passam a abrir o `wa.me` com a mensagem montada.

## Detalhes técnicos

- Fontes locais em `assets/fonts/` (Newsreader e Jost, subconjunto latino), com `preload` e `font-display: swap`.
- Imagens locais em `assets/` (WebP, origem Unsplash), em vez de links externos.
- Navegação por teclado, foco visível, `prefers-reduced-motion`, rótulos acessíveis.
- SEO: título, descrição, canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml`.
