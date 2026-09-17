
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const careTabs = document.querySelectorAll('.care-tab');
const careStageNumber = document.getElementById('care-stage-number');
const careStageTitle = document.getElementById('care-stage-title');
const careStageText = document.getElementById('care-stage-text');
const careStageImage = document.getElementById('care-stage-image');
const careStageLink = document.getElementById('care-stage-link');

careTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    careTabs.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    careStageNumber.textContent = tab.dataset.number;
    careStageTitle.textContent = tab.dataset.title;
    careStageText.textContent = tab.dataset.text;
    careStageImage.src = tab.dataset.image;
    careStageImage.alt = tab.dataset.title;
    careStageLink.href = tab.dataset.link;
    careStageLink.textContent = tab.dataset.cta;

    if (window.innerWidth <= 720) {
      setTimeout(() => {
        document.querySelector('.care-stage')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 80);
    }
  });
});

const feelItems = document.querySelectorAll('.feel-item');
const feelImage = document.getElementById('feel-image');

feelItems.forEach(item => {
  item.addEventListener('mouseenter', () => updateFeel(item));
  item.addEventListener('click', () => updateFeel(item));
});

function updateFeel(item) {
  if (!feelImage) return;
  const nextSrc = item.dataset.image;
  const preload = new Image();

  preload.onload = () => {
    feelImage.style.opacity = '0';
    setTimeout(() => {
      feelImage.src = nextSrc;
      feelImage.style.opacity = '1';
    }, 120);
  };

  preload.src = nextSrc;
}

const journeySteps = document.querySelectorAll('.journey-step');
const journeyNumber = document.getElementById('journey-number');
const journeyTitle = document.getElementById('journey-title');
const journeyCopy = document.getElementById('journey-copy');
const journeyPoints = document.getElementById('journey-points');

const journeyData = [
  {
    number: '01',
    title: 'Conversa',
    copy: 'Você conta o que gostaria de cuidar, suas experiências anteriores e suas expectativas.',
    points: [
      'Entendemos seu momento e sua intenção.',
      'Você pode falar com calma sobre dúvidas e expectativas.',
      'O processo começa pela escuta, não pela pressa.'
    ]
  },
  {
    number: '02',
    title: 'Avaliação',
    copy: 'Observamos as características da pele, rosto ou corpo relacionadas ao seu objetivo.',
    points: [
      'Analisamos o ponto de partida com atenção.',
      'Explicamos o que estamos observando de forma clara.',
      'A avaliação ajuda a evitar escolhas precipitadas.'
    ]
  },
  {
    number: '03',
    title: 'Possibilidades',
    copy: 'Explicamos os caminhos disponíveis, suas diferenças e o que pode ou não fazer sentido.',
    points: [
      'Você entende opções antes de decidir.',
      'Comparamos abordagens e expectativas.',
      'Nada é indicado de forma automática.'
    ]
  },
  {
    number: '04',
    title: 'Plano de cuidado',
    copy: 'Quando indicado, construímos uma proposta individualizada para o seu momento.',
    points: [
      'O plano considera sua rotina e prioridades.',
      'A frequência e a combinação de cuidados são explicadas.',
      'O objetivo é coerência, não excesso.'
    ]
  },
  {
    number: '05',
    title: 'Acompanhamento',
    copy: 'O cuidado continua depois do procedimento, com acompanhamento e ajustes quando necessário.',
    points: [
      'Observamos evolução e conforto ao longo do processo.',
      'Ajustes podem ser feitos quando necessário.',
      'Cuidar bem também é acompanhar bem.'
    ]
  }
];

journeySteps.forEach(step => {
  step.addEventListener('click', () => {
    journeySteps.forEach(item => item.classList.remove('active'));
    step.classList.add('active');

    const data = journeyData[Number(step.dataset.step)];
    journeyNumber.textContent = data.number;
    journeyTitle.textContent = data.title;
    journeyCopy.textContent = data.copy;

    journeyPoints.innerHTML = '';
    data.points.forEach(point => {
      const li = document.createElement('li');
      li.textContent = point;
      journeyPoints.appendChild(li);
    });
  });
});

document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const open = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
});

document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    const hero = img.closest('.hero-image');
    if (hero) hero.classList.add('image-error');

    const wrap = img.closest('.care-stage-image, .clinic-photo, .feel-visual');
    if (wrap) {
      wrap.style.background = 'linear-gradient(135deg, #5B2438, #B6A9C3)';
      img.style.display = 'none';
    }
  });
});

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}


// =========================================================
// CLÍNICA AURA — ESTRATÉGICO V5
// O site lembra as escolhas e adapta o conteúdo/CTA.
// Nenhuma mensagem é enviada: o projeto conceitual usa um modal-demo.
// =========================================================
(() => {
  const state = {
    area: 'Minha pele',
    areaKey: 'pele',
    intent: 'prevenção',
    intentLabel: 'Prevenção e cuidado contínuo'
  };

  const areaKeyMap = {
    'Minha pele': 'pele',
    'Meu rosto': 'rosto',
    'Meu corpo': 'corpo',
    'Meu momento': 'momento'
  };

  const responseCopy = {
    pele: {
      'prevenção': 'Um cuidado contínuo começa entendendo como sua pele está hoje, o que você quer preservar e quais hábitos fazem sentido para a sua rotina.',
      'queixa': 'A avaliação pode começar pela queixa que mais chama sua atenção e seguir para uma leitura mais ampla da pele, sem respostas automáticas.',
      'possibilidades': 'Você não precisa saber o nome de um procedimento. O primeiro passo pode ser entender quais caminhos existem e o que combina com sua pele.',
      'bem-estar': 'Cuidar da pele também pode ser um momento de pausa: uma experiência tranquila, com atenção à textura, conforto e rotina.'
    },
    rosto: {
      'prevenção': 'Prevenção facial é acompanhar mudanças com naturalidade, preservar características e decidir com calma quando algum cuidado faz sentido.',
      'queixa': 'Podemos começar pelo que chama sua atenção — cansaço, firmeza, contorno ou outra percepção — e avaliar o conjunto antes de pensar em procedimentos.',
      'possibilidades': 'O site guarda sua intenção para que a conversa comece pelas possibilidades faciais que fazem sentido para o seu momento.',
      'bem-estar': 'O cuidado facial pode ser menos sobre corrigir e mais sobre se sentir descansada, cuidada e confortável com a própria aparência.'
    },
    corpo: {
      'prevenção': 'Um plano corporal pode partir de hábitos, textura, firmeza e continuidade, sempre respeitando rotina e objetivos realistas.',
      'queixa': 'Se existe uma região ou incômodo específico, a avaliação organiza essa queixa dentro de um olhar mais completo sobre o corpo.',
      'possibilidades': 'Você pode conhecer abordagens corporais sem escolher nada agora. A avaliação ajuda a comparar possibilidades antes de decidir.',
      'bem-estar': 'O cuidado corporal também pode ser uma experiência de bem-estar, pausa e atenção ao próprio corpo.'
    },
    momento: {
      'prevenção': 'Criar espaço para cuidado antes de existir uma queixa também é uma forma de prevenção e continuidade.',
      'queixa': 'Mesmo quando existe um incômodo específico, o atendimento pode começar por uma conversa mais tranquila sobre o seu momento.',
      'possibilidades': 'Se você só quer entender possibilidades, o site guarda esse ponto de partida e leva esse contexto até a conversa.',
      'bem-estar': 'Aqui o objetivo é simples: reservar um tempo para você, sem transformar cuidado em obrigação.'
    }
  };

  const glowMap = {
    'prevenção': 'rgba(135,76,96,.08)',
    'queixa': 'rgba(121,92,129,.09)',
    'possibilidades': 'rgba(91,36,56,.07)',
    'bem-estar': 'rgba(174,145,121,.10)'
  };

  const intentOptions = document.querySelectorAll('.intent-option');
  const intentResponse = document.querySelector('.intent-response');
  const responseTitle = document.getElementById('intent-response-title');
  const responseCopyEl = document.getElementById('intent-response-copy');
  const responseLink = document.getElementById('intent-response-link');
  const finalSummaryTitle = document.getElementById('path-summary-title');
  const finalSummaryCopy = document.getElementById('path-summary-copy');
  const finalCTA = document.getElementById('personalized-final-cta');
  const smartCTA = document.getElementById('smart-whatsapp');
  const smartLabel = document.getElementById('smart-whatsapp-label');

  function buildMessage() {
    return `Olá! Conheci a Clínica Aura pelo site. Escolhi "${state.area}" e indiquei que busco "${state.intentLabel}". Gostaria de conversar sobre uma avaliação e entender quais possibilidades podem fazer sentido para mim.`;
  }

  function updatePersonalization(animate = true) {
    const copy = responseCopy[state.areaKey]?.[state.intent] || responseCopy.pele['prevenção'];
    if (intentResponse) {
      intentResponse.style.setProperty('--aura-glow', glowMap[state.intent] || glowMap['prevenção']);
      if (animate) intentResponse.classList.add('updating');
    }

    window.setTimeout(() => {
      if (responseTitle) responseTitle.textContent = `${state.area} + ${state.intentLabel}`;
      if (responseCopyEl) responseCopyEl.textContent = copy;
      if (finalSummaryTitle) finalSummaryTitle.textContent = `${state.area} · ${state.intentLabel}`;
      if (finalSummaryCopy) {
        finalSummaryCopy.textContent = 'A conversa pode começar exatamente por esse contexto, sem você precisar repetir tudo do zero.';
      }
      if (smartLabel) {
        const short = state.area.replace('Minha ', '').replace('Meu ', '');
        smartLabel.textContent = `Falar sobre ${short.toLowerCase()}`;
      }
      smartCTA?.classList.add('contextual');
      if (animate) intentResponse?.classList.remove('updating');
    }, animate ? 165 : 0);
  }

  // Preserve the initial photographed care state.
  document.querySelectorAll('.care-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.area = tab.dataset.title || state.area;
      state.areaKey = areaKeyMap[state.area] || 'pele';
      updatePersonalization(true);

      // Extra strategic transition only after interaction.
      const stage = document.querySelector('.care-stage');
      if (stage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        stage.classList.add('is-switching');
        setTimeout(() => stage.classList.remove('is-switching'), 360);
      }
    });
  });

  intentOptions.forEach(option => {
    option.addEventListener('click', () => {
      intentOptions.forEach(item => item.classList.remove('active'));
      option.classList.add('active');
      state.intent = option.dataset.intent || 'prevenção';
      state.intentLabel = option.dataset.label || 'Prevenção e cuidado contínuo';
      updatePersonalization(true);
    });
  });

  // Modal demo for all strategic contextual CTAs.
  const modal = document.getElementById('demo-modal');
  const demoText = document.getElementById('demo-message-text');
  const closeButtons = modal?.querySelectorAll('.demo-backdrop,.demo-close') || [];

  function openDemo(event) {
    event?.preventDefault();
    if (!modal || !demoText) return;
    demoText.textContent = buildMessage();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.demo-close')?.focus();
  }
  function closeDemo() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  [responseLink, finalCTA, smartCTA].forEach(el => el?.addEventListener('click', openDemo));

  // Nenhum CTA fictício abre um número inexistente. Os links demonstrativos
  // mostram a mensagem que seria enviada em um projeto real.
  document.querySelectorAll('a[href*="wa.me/5565999999999"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      if (!modal || !demoText) return;
      let message = buildMessage();
      try {
        const url = new URL(link.href);
        const original = url.searchParams.get('text');
        if (original && !link.matches('#care-stage-link')) message = original;
      } catch (_) {}
      demoText.textContent = message;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modal.querySelector('.demo-close')?.focus();
    });
  });
  closeButtons.forEach(el => el.addEventListener('click', closeDemo));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeDemo();
  });

  // Mouse-responsive micro light on selected cards (desktop only).
  if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.protocol-card,.decision-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((e.clientX-r.left)/r.width)*100}%`);
        card.style.setProperty('--my', `${((e.clientY-r.top)/r.height)*100}%`);
      });
    });
  }

  // Editorial line animation on selected headings without changing static layout.
  document.querySelectorAll('.listening-title h2,.protocols-head h2,.manifesto-copy h2,.local-copy h2')
    .forEach(el => el.classList.add('reveal-line'));

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const lineObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: .35 });
    document.querySelectorAll('.reveal-line').forEach(el => lineObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal-line').forEach(el => el.classList.add('visible'));
  }

  updatePersonalization(false);
})();
