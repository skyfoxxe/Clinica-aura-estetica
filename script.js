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
      const nextName = entry.target.querySelector('h3').textContent;
      if (stageName.textContent === nextName) return;
      stageNum.textContent = entry.target.querySelector('.numeral').textContent;
      stageName.textContent = nextName;
      const caption = stageName.parentElement;
      caption.getAnimations().forEach(anim => anim.cancel());
      caption.animate(
        reducedMotion() ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
        { duration: 500, easing: 'cubic-bezier(.22, 1, .36, 1)' }
      );
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

  /* ---------- movimento (GSAP + ScrollTrigger) ----------
     Contrato: o CSS deixa tudo visível. Só dentro do matchMedia "sem redução de movimento"
     o GSAP esconde e revela. Sem JS, sem GSAP ou com movimento reduzido, a página fica completa. */
  const { gsap, ScrollTrigger } = window;
  const releaseIntro = () => document.documentElement.classList.remove('motion-intro');
  if (!gsap || !ScrollTrigger) { releaseIntro(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* divide títulos em palavras dentro de uma máscara (o texto lido continua o mesmo) */
  const splitWords = (root) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) { walk(child); return; }
        if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const outer = document.createElement('span');
          outer.className = 'w';
          const inner = document.createElement('span');
          inner.className = 'wi';
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.replaceChild(frag, child);
      });
    };
    walk(root);
    root.classList.add('is-split');
    return $$('.wi', root);
  };

  const EASE_OUT = 'expo.out';
  const mm = gsap.matchMedia();

  mm.add({
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 768px)',
    finePointer: '(hover: hover) and (pointer: fine)'
  }, (context) => {
    const { motion, desktop, finePointer } = context.conditions;
    if (!motion) { releaseIntro(); return; }

    const heroEl = $('.hero');
    const heroTitle = $('#hero-title');
    /* no celular o título da abertura não se esconde: ele é o maior elemento da tela (LCP) */
    const splits = new Map($$('[data-split]').filter(el => desktop || el !== heroTitle).map(el => [el, splitWords(el)]));
    const heroImg = $('.hero .frame-media img');

    /* 1. abertura: uma única sequência, menos de 1,5 s (no celular, só esmaecimentos curtos) */
    const intro = gsap.timeline({ defaults: { ease: EASE_OUT } });
    if (desktop) {
      intro
        .from('.site-header', { autoAlpha: 0, y: -8, duration: 0.8 }, 0)
        .from('.hero .label', { autoAlpha: 0, y: 12, duration: 0.8 }, 0.1)
        .from(splits.get(heroTitle), { yPercent: 115, duration: 1, stagger: 0.04 }, 0.15)
        .fromTo(heroImg, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.18 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1.08, duration: 1.3, ease: 'power4.inOut' }, 0.2)
        .from('.hero-sub, .hero-actions', { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.1 }, 0.55);
    } else {
      intro.from('.hero-sub, .hero-actions', { autoAlpha: 0, y: 10, duration: 0.7, stagger: 0.08 }, 0.1);
    }
    releaseIntro();

    /* 2. títulos das seções: palavras sobem quando entram na tela */
    splits.forEach((words, el) => {
      if (heroEl.contains(el)) return;
      gsap.from(words, {
        yPercent: 115, duration: 1, ease: EASE_OUT, stagger: 0.035,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      });
    });

    /* 3. blocos de texto: entrada curta (14 px), em lotes, uma vez só */
    const blocks = $$('[data-reveal]').filter(el => !heroEl.contains(el));
    gsap.set(blocks, { autoAlpha: 0, y: 14 });
    ScrollTrigger.batch(blocks, {
      start: 'top 88%', once: true,
      onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true })
    });

    /* 4. fotos: cortina de baixo para cima e assentamento */
    $$('[data-clip]').forEach((el, index) => {
      if (heroEl.contains(el)) return;
      const img = el.tagName === 'IMG' ? el : $('img', el);
      const contained = el.classList.contains('ritual-img') || el.classList.contains('house-plate');
      gsap.fromTo(img,
        { clipPath: 'inset(100% 0% 0% 0%)', scale: contained ? 1.16 : 1 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: el.classList.contains('house-plate') && desktop ? 1.08 : 1,
          duration: 1.3, ease: 'power4.inOut', delay: el.classList.contains('ritual-img') ? (index % 4) * 0.1 : 0,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });

    /* 5. números dos compromissos contam ao aparecer */
    $$('.proof-num').forEach(num => {
      const target = Number(num.dataset.count);
      const counter = { v: 0 };
      gsap.to(counter, {
        v: target, duration: 1.4, ease: 'power2.out', snap: { v: 1 },
        onUpdate: () => { num.textContent = String(Math.round(counter.v)); },
        scrollTrigger: { trigger: num, start: 'top 90%', once: true }
      });
    });

    /* 6. linha de progresso da leitura, no cabeçalho */
    gsap.to('.scroll-progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.4 }
    });

    /* 7. só no desktop: paralaxe leve e o trilho dos quatro tempos */
    if (desktop) {
      [[heroImg, '.hero .frame'], [$('.house-plate img'), '.house-plate']].forEach(([img, trigger]) => {
        gsap.fromTo(img, { yPercent: -3 }, {
          yPercent: 3, ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        });
      });
      gsap.to('.stage-rail span', {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.tempos-list', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 }
      });
    }

    /* 8. botão principal da abertura com leve atração magnética (até 5 px), só com mouse */
    if (finePointer) {
      $$('.btn-magnetic').forEach(btn => {
        const toX = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
        const toY = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
        const move = (event) => {
          const r = btn.getBoundingClientRect();
          toX(gsap.utils.clamp(-5, 5, (event.clientX - (r.left + r.width / 2)) * 0.12));
          toY(gsap.utils.clamp(-5, 5, (event.clientY - (r.top + r.height / 2)) * 0.2));
        };
        const leave = () => { toX(0); toY(0); };
        btn.addEventListener('pointermove', move);
        btn.addEventListener('pointerleave', leave);
        return () => { btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerleave', leave); };
      });
    }

    /* desfaz a divisão dos títulos se o usuário passar a pedir movimento reduzido */
    return () => {
      splits.forEach((words, el) => {
        words.forEach(w => w.parentElement.replaceWith(document.createTextNode(w.textContent)));
        el.normalize();
        el.classList.remove('is-split');
      });
    };
  });

  /* recalcula as posições depois das fontes e imagens */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
