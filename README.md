# Clínica Aura · Estética integrada

Projeto conceitual de portfólio. Clínica, profissionais, contatos e localização são fictícios.

Site estático (HTML, CSS e JavaScript, sem dependências). Publicado em https://clinicaauraestetica.vercel.app/.

## Versão 6 · refeita

A versão anterior tinha 15 seções e cinco mecanismos de escolha que se sobrepunham (abas de cuidado, cartões "já sei / não sei", objetivo, "como quer se sentir" e protocolos). A v6 condensa tudo em uma página mais curta, com um único guia.

- **Hero** com a promessa da marca, retrato editorial e os quatro valores de atendimento.
- **Manifesto** de naturalidade ("Sua aparência não precisa seguir uma tendência").
- **Seu caminho na Aura**: duas escolhas (área + objetivo) atualizam na hora o texto, a imagem, o protocolo sugerido e a mensagem de WhatsApp que será enviada. A escolha fica salva no navegador.
- **Protocolos Aura** com o protocolo sugerido destacado.
- **Como começa**: as cinco etapas visíveis de uma vez, sem cliques.
- **A clínica**, **Dúvidas** (com `<details>`, acessível sem JavaScript) e **CTA final** com o caminho escolhido.
- Botão flutuante de WhatsApp contextual, que se esconde onde já existe um botão de conversa visível.

## WhatsApp

Como o projeto é fictício, os botões abrem uma simulação com a mensagem pronta. Para um cliente real, preencha `WHATSAPP_NUMBER` no início de `script.js` (ex.: `'5565999999999'`) e os botões passam a abrir o `wa.me` com a mensagem montada.

## Detalhes técnicos

- Paleta original mantida (vinho `#5B2438`, rosé, creme). Tipografia: Newsreader + Manrope (Google Fonts).
- Imagens locais em `assets/` (WebP, origem Unsplash), em vez de links externos.
- Navegação por teclado, foco visível, `prefers-reduced-motion`, rótulos acessíveis.
- SEO: título, descrição, canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml`.
