/* Aura · interações
   Projeto conceitual: os botões de WhatsApp abrem uma demonstração em vez de enviar mensagens. */

(() => {
  'use strict';

  const WHATSAPP_NUMBER = ''; // Em um projeto real: '5565999999999'. Vazio = modo demonstração.
  const STORAGE_KEY = 'aura-consulta';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- conteúdo da consulta ---------- */
  const AREAS = {
    pele:    { care: 'da sua pele',          mine: 'da minha pele',         ritual: 'Aura Pele' },
    rosto:   { care: 'do seu rosto',         mine: 'do meu rosto',          ritual: 'Aura Fresh' },
    corpo:   { care: 'do seu corpo',         mine: 'do meu corpo',          ritual: 'Aura Contorno' },
    momento: { care: 'de um momento só seu', mine: 'de um momento só meu',  ritual: 'Aura Reset' }
  };

  const INTENTS = {
    prevencao:      { phrase: 'com foco em prevenir e manter' },
    queixa:         { phrase: 'a partir de uma queixa específica' },
    possibilidades: { phrase: 'para entender as possibilidades' },
    'bem-estar':    { phrase: 'como uma forma de desacelerar' }
  };

  const FEELS = {
    luz:       'luminosidade',
    descanso:  'descanso',
    cuidado:   'cuidado',
    confianca: 'confiança'
  };

  const COPY = {
    pele: {
      prevencao: 'Um cuidado contínuo começa entendendo como sua pele está hoje, o que você quer preservar e quais hábitos cabem na sua rotina.',
      queixa: 'A avaliação pode começar pela queixa que mais chama sua atenção e seguir para uma leitura mais ampla da pele, sem respostas automáticas.',
      possibilidades: 'O primeiro passo é conhecer os caminhos que existem e descobrir, com calma, quais combinam com a sua pele.',
      'bem-estar': 'Cuidar da pele também pode ser uma pausa: uma experiência tranquila, com atenção à textura, ao conforto e à rotina.'
    },
    rosto: {
      prevencao: 'Prevenção facial é acompanhar mudanças com naturalidade, preservar suas características e decidir com calma quando algum cuidado faz sentido.',
      queixa: 'Podemos começar pelo que chama sua atenção, seja cansaço, firmeza ou contorno, e olhar o conjunto antes de pensar em procedimentos.',
      possibilidades: 'A conversa começa pelas possibilidades faciais que fazem sentido para o seu momento, sem pressa para escolher.',
      'bem-estar': 'O cuidado facial pode ser menos sobre corrigir e mais sobre se sentir bem com a própria aparência.'
    },
    corpo: {
      prevencao: 'Um plano corporal pode partir de hábitos, textura, firmeza e continuidade, sempre com objetivos realistas.',
      queixa: 'Se existe uma região ou incômodo específico, a avaliação organiza essa queixa dentro de um olhar mais completo sobre o corpo.',
      possibilidades: 'Você pode conhecer as abordagens corporais sem escolher nada agora. A avaliação ajuda a comparar antes de decidir.',
      'bem-estar': 'O cuidado corporal também pode ser uma experiência de pausa e de atenção ao próprio corpo.'
    },
    momento: {
      prevencao: 'Reservar um tempo para si antes de existir uma queixa também é uma forma de prevenção.',
      queixa: 'Mesmo quando existe um incômodo específico, o atendimento pode começar por uma conversa tranquila sobre o seu momento.',
      possibilidades: 'Se a ideia é só entender o que existe, é um ótimo começo. Levamos esse contexto para a conversa.',
      'bem-estar': 'Aqui o objetivo é simples: um tempo para você, sem transformar o cuidado em obrigação.'
    }
  };

  /* ---------- estado ---------- */
  const state = { area: null, intent: null, feel: null };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && AREAS[saved.area] && INTENTS[saved.intent] && FEELS[saved.feel]) Object.assign(state, saved);
  } catch (_) { /* armazenamento indisponível */ }

  const persist = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* ignora */ }
  };
  const complete = () => Boolean(state.area && state.intent && state.feel);

  /* ---------- mensagens ---------- */
  const messages = {
    geral: () => 'Olá! Vim pelo site da Aura e gostaria de agendar uma avaliação.',
    carta: () => complete()
      ? `Olá! Fiz a consulta no site da Aura. Quero cuidar ${AREAS[state.area].mine}, ${INTENTS[state.intent].phrase}, e busco uma sensação de ${FEELS[state.feel]}. Podemos conversar sobre uma avaliação?`
      : messages.geral(),
    procedimento: () => 'Olá! Vim pelo site da Aura. Já conheço um procedimento e gostaria de saber se ele é adequado para mim.',
    duvidas: () => 'Olá! Vim pelo site da Aura e gostaria de tirar algumas dúvidas antes de agendar.',
    ritual: (el) => `Olá! Vim pelo site da Aura e gostaria de saber mais sobre o ritual ${el.dataset.ritual}.`
  };

  /* ---------- consulta em três passos ---------- */
  const quiz = $('#quiz');
  const steps = $$('.quiz-step', quiz);
  const dots = $$('.quiz-progress span', quiz);
  const count = $('#quiz-count');
  const back = $('#quiz-back');
  const letter = $('#letter');
  const keys = ['area', 'intent', 'feel'];
  let current = 0;

  function showStep(index, { focus = true } = {}) {
    current = index;
    steps.forEach((step, i) => {
      const on = i === index;
      step.hidden = !on;
      step.classList.toggle('is-current', on);
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-on', i <= index));
    count.textContent = `Pergunta ${index + 1} de ${steps.length}`;
    back.hidden = index === 0;

    // marca a resposta já escolhida, se houver
    $$(`input[name="${keys[index]}"]`, steps[index]).forEach(input => { input.checked = input.value === state[keys[index]]; });

    if (focus) {
      const target = $(`input[name="${keys[index]}"]:checked`, steps[index]) || $('input', steps[index]);
      target?.focus({ preventScroll: true });
    }
  }

  function showLetter({ focus = true } = {}) {
    const area = AREAS[state.area];
    const intent = INTENTS[state.intent];
    const today = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

    $('#letter-date').textContent = `Cuiabá, ${today}`;
    $('#letter-text').textContent = `Você nos contou que quer cuidar ${area.care}, ${intent.phrase}, e que gostaria de sair daqui com uma sensação de ${FEELS[state.feel]}.`;
    $('#letter-copy').textContent = COPY[state.area][state.intent];
    $('#letter-ritual').textContent = `Um bom ponto de partida seria o ritual ${area.ritual}, sempre ajustado depois da avaliação.`;
    $('#letter-message').textContent = messages.carta();

    quiz.hidden = true;
    letter.hidden = false;
    $$('.ritual').forEach(li => li.classList.toggle('is-suggested', li.dataset.area === state.area));
    if (focus) letter.focus({ preventScroll: true });
  }

  function restart() {
    state.area = state.intent = state.feel = null;
    persist();
    letter.hidden = true;
    quiz.hidden = false;
    $$('.ritual').forEach(li => li.classList.remove('is-suggested'));
    showStep(0);
  }

  let advanceTimer = null;
  quiz.addEventListener('change', (event) => {
    const input = event.target;
    if (!input.matches('input[type="radio"]')) return;
    state[input.name] = input.value;
    persist();

    // pequena pausa para a escolha ser vista antes de avançar
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(() => {
      if (current < steps.length - 1) showStep(current + 1);
      else showLetter();
    }, reducedMotion() ? 0 : 320);
  });

  // teclado: as setas trocam a opção (padrão do navegador); Enter confirma e avança
  quiz.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.matches('input[type="radio"]')) {
      event.preventDefault();
      event.target.checked = true;
      event.target.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  quiz.addEventListener('submit', (event) => event.preventDefault());

  back.addEventListener('click', () => showStep(Math.max(0, current - 1)));
  $('#quiz-restart').addEventListener('click', restart);

  if (complete()) showLetter({ focus: false });
  else showStep(0, { focus: false });

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
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  /* ---------- menu do celular ---------- */
  const toggle = $('.menu-toggle');
  const nav = $('#main-nav');
  const header = $('.site-header');

  const setMenu = (open) => {
    header.classList.toggle('menu-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  toggle?.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      toggle?.focus();
    }
  });

  if (!('IntersectionObserver' in window)) return;

  /* ---------- os quatro tempos: imagem acompanha a leitura ---------- */
  const stageImgs = $$('.tempos-stage img');
  const stageNum = $('#stage-num');
  const stageName = $('#stage-name');
  const tempos = $$('.tempo');

  const tempoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const i = Number(entry.target.dataset.tempo);
      tempos.forEach(t => t.classList.toggle('is-active', t === entry.target));
      stageImgs.forEach(img => img.classList.toggle('is-active', Number(img.dataset.stage) === i));
      stageNum.textContent = entry.target.querySelector('.numeral').textContent;
      stageName.textContent = entry.target.querySelector('h3').textContent;
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  tempos.forEach(t => tempoObserver.observe(t));

  /* ---------- barra de conversa no celular ---------- */
  const bar = $('.wa-bar');
  const hero = $('.hero');
  const quietZones = $$('.consult, .closing');
  let heroVisible = true;
  const zoneState = new Map();
  const syncBar = () => {
    const inQuietZone = Array.from(zoneState.values()).some(Boolean);
    bar.classList.toggle('is-visible', !heroVisible && !inQuietZone);
  };

  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; syncBar(); }, { rootMargin: '-30% 0px 0px 0px' }).observe(hero);
  const zoneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => zoneState.set(entry.target, entry.isIntersecting));
    syncBar();
  });
  quietZones.forEach(zone => zoneObserver.observe(zone));

  /* ---------- entrada suave ---------- */
  if (reducedMotion()) return;
  document.documentElement.classList.add('js-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  $$('[data-reveal]').forEach(el => {
    const siblings = Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-reveal'));
    el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 4) * 80}ms`);
    revealObserver.observe(el);
  });
})();
