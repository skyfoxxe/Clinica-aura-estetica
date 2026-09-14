
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
