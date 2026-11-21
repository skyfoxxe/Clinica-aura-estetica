/* Clínica Aura · interações
   Projeto conceitual: os botões de WhatsApp abrem uma simulação em vez de enviar mensagens. */

(() => {
  'use strict';

  const WHATSAPP_NUMBER = ''; // Em um projeto real: '5565999999999'. Vazio = modo demonstração.
  const STORAGE_KEY = 'aura-caminho';

  const AREAS = {
    pele: {
      label: 'Minha pele', short: 'pele', protocol: 'Aura Pele',
      image: 'assets/ritual-oleo.webp', alt: 'Mãos aplicando gotas de óleo facial', position: '50% 50%'
    },
    rosto: {
      label: 'Meu rosto', short: 'rosto', protocol: 'Aura Fresh',
      image: 'assets/retrato-pele.webp', alt: 'Retrato de mulher de cabelo ruivo com franja', position: '50% 32%'
    },
    corpo: {
      label: 'Meu corpo', short: 'corpo', protocol: 'Aura Contorno',
      image: 'assets/pedras-quentes.webp', alt: 'Pedras quentes alinhadas sobre as costas durante uma sessão', position: '35% 50%'
    },
    momento: {
      label: 'Meu momento', short: 'bem-estar', protocol: 'Aura Reset',
      image: 'assets/pedras-quentes.webp', alt: 'Orquídeas brancas e pedras quentes em uma sessão de bem-estar', position: '92% 50%'
    }
  };

  const INTENTS = {
    prevencao: 'Prevenção e cuidado contínuo',
    queixa: 'Avaliar uma queixa específica',
    possibilidades: 'Conhecer possibilidades',
    'bem-estar': 'Bem-estar e tempo para mim'
  };

  const COPY = {
    pele: {
      prevencao: 'Um cuidado contínuo começa entendendo como sua pele está hoje, o que você quer preservar e quais hábitos fazem sentido para a sua rotina.',
      queixa: 'A avaliação pode começar pela queixa que mais chama sua atenção e seguir para uma leitura mais ampla da pele, sem respostas automáticas.',
      possibilidades: 'Você não precisa saber o nome de um procedimento. O primeiro passo é entender quais caminhos existem e o que combina com a sua pele.',
      'bem-estar': 'Cuidar da pele também pode ser um momento de pausa: uma experiência tranquila, com atenção à textura, ao conforto e à rotina.'
    },
    rosto: {
      prevencao: 'Prevenção facial é acompanhar mudanças com naturalidade, preservar suas características e decidir com calma quando algum cuidado faz sentido.',
      queixa: 'Podemos começar pelo que chama sua atenção, seja cansaço, firmeza ou contorno, e avaliar o conjunto antes de pensar em procedimentos.',
      possibilidades: 'A conversa começa pelas possibilidades faciais que fazem sentido para o seu momento, sem pressa para escolher.',
      'bem-estar': 'O cuidado facial pode ser menos sobre corrigir e mais sobre se sentir descansada, cuidada e confortável com a própria aparência.'
    },
    corpo: {
      prevencao: 'Um plano corporal pode partir de hábitos, textura, firmeza e continuidade, sempre respeitando sua rotina e objetivos realistas.',
      queixa: 'Se existe uma região ou incômodo específico, a avaliação organiza essa queixa dentro de um olhar mais completo sobre o corpo.',
      possibilidades: 'Você pode conhecer abordagens corporais sem escolher nada agora. A avaliação ajuda a comparar caminhos antes de decidir.',
      'bem-estar': 'O cuidado corporal também pode ser uma experiência de pausa e atenção ao próprio corpo.'
    },
    momento: {
      prevencao: 'Criar espaço para cuidado antes de existir uma queixa também é uma forma de prevenção.',
      queixa: 'Mesmo quando existe um incômodo específico, o atendimento pode começar por uma conversa tranquila sobre o seu momento.',
      possibilidades: 'Se você só quer entender o que existe, essa é uma ótima forma de começar. Levamos esse contexto para a conversa.',
      'bem-estar': 'Aqui o objetivo é simples: reservar um tempo para você, sem transformar cuidado em obrigação.'
    }
  };

  /* ---------- estado ---------- */
  const state = { area: 'pele', intent: 'prevencao' };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && AREAS[saved.area] && INTENTS[saved.intent]) Object.assign(state, saved);
  } catch (_) { /* armazenamento indisponível: segue com o padrão */ }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const pathLabel = () => `${AREAS[state.area].label} · ${INTENTS[state.intent]}`;

  const messages = {
    geral: () => 'Olá! Vim pelo site da Clínica Aura e gostaria de agendar uma avaliação.',
    caminho: () => `Olá! Vim pelo site da Clínica Aura. Escolhi "${AREAS[state.area].label}" e busco "${INTENTS[state.intent].toLowerCase()}". Gostaria de conversar sobre uma avaliação e entender o que faz sentido para mim.`,
    procedimento: () => 'Olá! Vim pelo site da Clínica Aura. Já conheço um procedimento e gostaria de conversar para saber se ele é adequado para mim.',
    duvidas: () => 'Olá! Vim pelo site da Clínica Aura e gostaria de tirar algumas dúvidas antes de agendar.',
    protocolo: (el) => `Olá! Vim pelo site da Clínica Aura e gostaria de saber mais sobre o protocolo ${el.dataset.protocol}.`
  };

  /* ---------- render ---------- */
  const resultImage = $('#result-image');
  const resultEl = $('.result');
  let firstRender = true;

  function render() {
    const area = AREAS[state.area];
    const update = () => {
      $('#result-title').textContent = pathLabel();
      $('#result-copy').textContent = COPY[state.area][state.intent];
      $('#result-protocol').textContent = `Ponto de partida: ${area.protocol}`;
      $('#result-message').textContent = messages.caminho();
      $('#closing-path').textContent = pathLabel();
      $('#wa-float-label').textContent = `Conversar sobre ${area.short}`;

      if (resultImage && resultImage.getAttribute('src') !== area.image) resultImage.src = area.image;
      if (resultImage) {
        resultImage.alt = area.alt;
        resultImage.style.objectPosition = area.position;
      }

      $$('.protocol-list li').forEach(li => li.classList.toggle('is-suggested', li.dataset.area === state.area));
    };

    if (firstRender || !resultEl || reducedMotion()) {
      update();
      firstRender = false;
      return;
    }
    resultEl.classList.add('is-changing');
    setTimeout(() => {
      update();
      resultEl.classList.remove('is-changing');
    }, 180);
  }

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // sincroniza os inputs com o estado salvo
  $$('input[name="area"]').forEach(input => {
    input.checked = input.value === state.area;
    input.addEventListener('change', () => {
      state.area = input.value;
      persist();
      render();
    });
  });

  $$('input[name="intent"]').forEach(input => {
    input.checked = input.value === state.intent;
    input.addEventListener('change', () => {
      state.intent = input.value;
      persist();
      render();
    });
  });

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* ignora */ }
  }

  render();

  /* ---------- WhatsApp ---------- */
  const dialog = $('#demo');

  $$('[data-wa]').forEach(link => {
    link.addEventListener('click', (event) => {
      const build = messages[link.dataset.wa] || messages.geral;
      const text = build(link);

      if (WHATSAPP_NUMBER) {
        link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        link.target = '_blank';
        link.rel = 'noopener';
        return;
      }

      event.preventDefault();
      $('#demo-message').textContent = text;
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        window.alert(text);
      }
    });
  });

  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  /* ---------- menu mobile ---------- */
  const toggle = $('.menu-toggle');
  const nav = $('#main-nav');
  const header = $('.site-header');

  toggle?.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    header.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- cabeçalho e botão flutuante ---------- */
  const floatBtn = $('.wa-float');
  const hero = $('.hero');
  // o botão flutuante some onde já existe um botão de conversa visível (guia e chamada final)
  const quietZones = $$('.guide, .closing');

  if ('IntersectionObserver' in window && floatBtn && hero) {
    let heroVisible = true;
    const visibleZones = new Map();
    const sync = () => {
      const inQuietZone = Array.from(visibleZones.values()).some(Boolean);
      floatBtn.classList.toggle('is-visible', !heroVisible && !inQuietZone);
    };

    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      header.classList.toggle('is-scrolled', !heroVisible);
      sync();
    }, { rootMargin: '-30% 0px 0px 0px' }).observe(hero);

    const zoneObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => visibleZones.set(entry.target, entry.isIntersecting));
      sync();
    });
    quietZones.forEach(zone => zoneObserver.observe(zone));
  }

  /* ---------- revelação suave ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion()) {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-reveal'));
      el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
      io.observe(el);
    });
  }
})();
