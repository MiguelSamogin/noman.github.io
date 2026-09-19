const introScreen = document.getElementById("intro-screen");
const introRope = document.getElementById("intro-rope-wrapper");
const introLogo = document.getElementById("intro-logo");
const letterM = document.getElementById("letter-m");
const letterN1 = document.getElementById("letter-n1");
const letterO = document.getElementById("letter-o");
const letterA = document.getElementById("letter-a");
const letterN2 = document.getElementById("letter-n2");
const otherLetters = [letterN1, letterO, letterA, letterN2];
const introSubtitle = document.getElementById("intro-subtitle");
const introFlash = document.getElementById("intro-flash");
const introLightBeam = document.getElementById("intro-light-beam");
const introShockwave = document.getElementById("intro-shockwave");
const introSkip = document.getElementById("intro-skip");

if (introScreen) document.body.classList.add("landing-pending");

// Animação de introdução: a corda se solta, o logo cai, as letras se espalham e a luz ilumina a tela.

let introCompleted = false;

function finishIntro() {
  if (introCompleted) return;
  introCompleted = true;
  document.body.classList.remove("intro-active");

  if (introScreen) {
    if (window.gsap) {
      gsap.to(introScreen, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => {
          introScreen.style.display = "none";
          introScreen.remove();
          animateLandingEntrance();
        }
      });
    } else {
      introScreen.style.display = "none";
      introScreen.remove();
      animateLandingEntrance();
    }
  } else {
    animateLandingEntrance();
  }

}


// Inicia a animação assim que o script é executado
if (introScreen) {
  document.body.classList.add("intro-active");

  // Failsafe de segurança: se por qualquer motivo demorar, destrava após 12s
  const failsafeTimeout = setTimeout(() => {
    if (!introCompleted) finishIntro();
  }, 12000);

    // Botão Pular e tecla ESC
  if (introSkip) {
    introSkip.addEventListener("click", () => {
      clearTimeout(failsafeTimeout);
      finishIntro();
    });
  }

    window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      clearTimeout(failsafeTimeout);
      finishIntro();
    }
  });

    // Se o GSAP estiver carregado, orquestra a timeline completa
  if (window.gsap) {
    // Configurações iniciais dos elementos
    gsap.set(introScreen, { clipPath: "circle(160% at 50% 50%)" });
    gsap.set(otherLetters, { opacity: 0, scale: 0.3, y: 10 });
    gsap.set(letterN1, { x: -80 });
    gsap.set(letterO, { x: -40 });
    gsap.set(letterA, { x: 40 });
    gsap.set(letterN2, { x: 80 });
    gsap.set(introSubtitle, { opacity: 0, y: 15 });
    gsap.set(introFlash, { opacity: 0, scale: 0.4 });
    gsap.set(introLightBeam, { opacity: 0, scale: 0 });
    gsap.set(introShockwave, { opacity: 0, scale: 0.3 });


    // Posição inicial: M pendurado fora da tela no topo com a corda
    const startY = -window.innerHeight * 0.65;
    gsap.set(letterM, { y: startY, rotation: 7, transformOrigin: "center top" });
    gsap.set(introRope, { y: startY, rotation: 7, transformOrigin: "center top" });

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(failsafeTimeout);
        finishIntro();
      }
    });

     // 1. O "M" desce balançando suavemente no ar com a corda
    tl.to([introRope, letterM], {
      y: 0,
      duration: 1.1,
      ease: "power2.out"
    })
    .to([introRope, letterM], {
      rotation: -4,
      duration: 0.45,
      ease: "sine.inOut"
    }, "-=0.35")
    .to([introRope, letterM], {
      rotation: 0,
      duration: 0.35,
      ease: "sine.out"
    })

    // 2. 💥 1º Pingo / Impacto Elástico ("pinga uma vez")
    // Puxa para baixo com tensão elástica
    .to(letterM, {
      y: 48,
      duration: 0.22,
      ease: "power2.in"
    }, "+=0.08")
    .to(introRope, {
      scaleY: 1.12,
      duration: 0.22,
      ease: "power2.in"
    }, "<")

    // Rebote elástico para a posição original
    .to(letterM, {
      y: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.4)"
    })
    .to(introRope, {
      scaleY: 1,
      duration: 0.65,
      ease: "elastic.out(1, 0.4)"
    }, "<")

    // Onda de choque do 1º impacto
    .to(introShockwave, {
      opacity: 0.85,
      scale: 1.7,
      duration: 0.35,
      ease: "power2.out"
    }, "<")
    .to(introShockwave, {
      opacity: 0,
      scale: 2.5,
      duration: 0.25,
      ease: "power1.in"
    }, "-=0.15")

    // O restante do NOMAN surge estalando ao lado do M!
    .to(otherLetters, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.55,
      ease: "back.out(1.8)",
      stagger: {
        each: 0.05,
        from: "center"
      }
    }, "-=0.65")

     // Subtítulo surge sincronizado
    .to(introSubtitle, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out"
    }, "-=0.25")

    // 3. Breve momento dramático com o logo completo no ar
    .to(introLogo, {
      scale: 1.02,
      duration: 0.3,
      ease: "sine.inOut"
    }, "+=0.15")

    // 4. ⚡ 2º Pingo / Impacto Monumental ("pingam de novo")
    // A corda se rompe e se recolhe para cima
    .to(introRope, {
      y: -window.innerHeight * 0.6,
      opacity: 0,
      duration: 0.22,
      ease: "power3.in"
    })

    // O logo inteiro dá um puxão para cima e DESPENCA com impacto forte
    .to(introLogo, {
      y: -20,
      duration: 0.16,
      ease: "power2.out"
    }, "<")
    .to(introLogo, {
      y: 35,
      duration: 0.15,
      ease: "power4.in"
    })

    // 5. 💥 2º Impacto: Explosão de Luz Rosa e Abertura Orgânica do Site
    // Onda de choque de energia rosa expansiva
    .to(introShockwave, {
      opacity: 1,
      scale: 5.5,
      borderColor: "#efaebf",
      boxShadow: "0 0 70px rgba(239, 174, 191, 0.95), 0 0 140px rgba(239, 174, 191, 0.7)",
      duration: 0.55,
      ease: "power2.out"
    }, "<")

    // Feixe e portal de luz rosa suave expandem do centro preenchendo toda a tela
    .to(introLightBeam, {
      scale: 1.8,
      opacity: 1,
      duration: 0.38,
      ease: "power3.out"
    }, "<")

    // Clarão radiante de luz rosa e branca preenche a tela
    .to(introFlash, {
      scale: 1.4,
      opacity: 1,
      duration: 0.32,
      ease: "power2.out"
    }, "<0.04")

    // Logo e subtítulo dissolvem-se harmonicamente na luz rosa
    .to([introLogo, introSubtitle], {
      scale: 1.12,
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.32,
      ease: "power2.in"
    }, "<0.06")

    // O fundo preto se dissolve, deixando apenas a luz rosa pura sobre o site
    .to(introScreen, {
      backgroundColor: "transparent",
      backgroundImage: "none",
      duration: 0.45,
      ease: "power2.inOut"
    }, "<0.08")

    // Destrava o scroll do site
    .add(() => {
      document.body.classList.remove("intro-active");
    }, "-=0.15")

    // A luz rosa recua e se dissipa suavemente, desvelando o site iluminado
    .to(introFlash, {
      opacity: 0,
      scale: 1.9,
      duration: 0.10,
      ease: "power2.out"
    }, "-=0.08")
    .to(introLightBeam, {
      opacity: 0,
      scale: 2.5,
      duration: 0.2,
      ease: "power2.out"
    }, "<")
    .to(introShockwave, {
      opacity: 0,
      scale: 11,
      duration: 0.30,
      ease: "power2.out"
    }, "<");

  } else {
    setTimeout(finishIntro, 1000);
  }
}


/* JAVASCRIPT DO SITE NOMAN — controla menu, animações e formulário. */

// Seleciona elementos do cabeçalho e botão flutuante no HTML.
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu");
const floatingNavBtn = document.getElementById("nav-floating-btn");

// Ao rolar a página: o cabeçalho dá lugar ao botão circular flutuante.
window.addEventListener("scroll", () => {
  const isScrolled = window.scrollY > 80;
  document.body.classList.toggle("page-scrolled", isScrolled);
  header.classList.toggle("scrolled", isScrolled);

  // Se o usuário rolou de volta para o topo, fecha a ilha aberta
  if (!isScrolled) {
    header.classList.remove("island-open");
    if (floatingNavBtn) {
      floatingNavBtn.classList.remove("active");
      floatingNavBtn.setAttribute("aria-expanded", "false");
    }
  }
}, { passive: true });

// Ao clicar no botão circular: abre ou fecha a ilha flutuante de navegação.
if (floatingNavBtn) {
  floatingNavBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = header.classList.toggle("island-open");
    floatingNavBtn.classList.toggle("active", isOpen);
    floatingNavBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

// Abre ou fecha o menu em celulares.
if (menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Fechar" : "Menu";
  });
}

// Fecha a ilha flutuante e o menu mobile depois que qualquer link da navegação for selecionado.
document.querySelectorAll(".site-header a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("island-open");
    header.classList.remove("open");
    if (floatingNavBtn) {
      floatingNavBtn.classList.remove("active");
      floatingNavBtn.setAttribute("aria-expanded", "false");
    }
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    }
  });
});

// Fecha a ilha ao clicar fora dela quando estiver aberta.
document.addEventListener("click", (event) => {
  if (header && header.classList.contains("island-open")) {
    if (!header.contains(event.target) && (!floatingNavBtn || !floatingNavBtn.contains(event.target))) {
      header.classList.remove("island-open");
      if (floatingNavBtn) {
        floatingNavBtn.classList.remove("active");
        floatingNavBtn.setAttribute("aria-expanded", "false");
      }
    }
  }
});

// Detecta quando os elementos entram na tela.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // A classe "visible" ativa a animação de entrada definida no CSS.
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Observa todos os elementos que possuem a classe "reveal".
document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// Seleciona o painel visual da primeira seção.
const heroVisual = document.querySelector(".hero-visual");
const heroFrame = document.querySelector(".image-frame");

// Verifica se o dispositivo usa mouse e se o usuário permite animações.
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Cria o efeito de profundidade que acompanha o cursor.
if (heroVisual && heroFrame && hasFinePointer && !reducedMotion) {
  heroVisual.addEventListener("pointermove", (event) => {
    const area = heroVisual.getBoundingClientRect();
    const horizontal = (event.clientX - area.left) / area.width - 0.5;
    const vertical = (event.clientY - area.top) / area.height - 0.5;

    // Envia os ângulos para as variáveis CSS responsáveis pela rotação.
    heroFrame.style.setProperty("--tilt-x", `${horizontal * 4}deg`);
    heroFrame.style.setProperty("--tilt-y", `${vertical * -4}deg`);
  });

  // Retorna o painel à posição inicial quando o cursor sai da área.
  heroVisual.addEventListener("pointerleave", () => {
    heroFrame.style.setProperty("--tilt-x", "0deg");
    heroFrame.style.setProperty("--tilt-y", "0deg");
  });
}

// Insere automaticamente o ano atual no rodapé.
document.getElementById("year").textContent = new Date().getFullYear();

// Seleciona o formulário e intercepta seu envio.
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // FormData coleta os valores preenchidos pelo visitante.
    const data = new FormData(contactForm);
    const name = data.get("nome") || "";
    const company = data.get("empresa") || "";
    const phone = data.get("telefone") || "";
    const email = data.get("email") || "";
    const project = data.get("mensagem") || "";

    // E-mail oficial da NOMAN para receber as mensagens.
    const recipientEmail = "contato@noman.com.br";
    const subject = `Contato via site NOMAN — ${name}${company ? ` (${company})` : ""}`;

    // Monta o corpo do e-mail de forma organizada.
    const body = `Olá, NOMAN!\n\n` +
      `Nome: ${name}\n` +
      `Empresa: ${company || "Não informada"}\n` +
      `E-mail: ${email}\n` +
      `Telefone: ${phone || "Não informado"}\n\n` +
      `Mensagem / Desafio:\n${project}\n`;

    // Atualiza a nota do formulário para dar retorno ao visitante.
    const formNote = contactForm.querySelector(".form-note");
    if (formNote) {
      formNote.textContent = "Abrindo seu aplicativo de e-mail para envio...";
    }

    // Abre o cliente de e-mail padrão do visitante com a mensagem preenchida.
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  });
}

// Seleciona a galeria do processo e seus controles de navegação.
const processGallery = document.querySelector(".process-gallery");
const processCards = processGallery ? Array.from(processGallery.querySelectorAll(".cards li")) : [];
const nextProcessButton = processGallery?.querySelector(".next");
const previousProcessButton = processGallery?.querySelector(".prev");

// Guarda o estado atual da galeria, do autoplay e do gesto de arraste.
let activeProcessCard = 0;
let dragStartX = 0;
let dragStartY = 0;
let dragLastX = 0;
let dragLastTime = 0;
let dragDistance = 0;
let dragVelocity = 0;
let isDraggingProcess = false;
let isHorizontalProcessDrag = false;
let dragOriginIndex = 0;
let dragPreviewIndex = 0;
let processAutoplayTimer;

function scheduleProcessAutoplay() {
  // Reinicia o contador sempre que o visitante interage com a galeria.
  clearTimeout(processAutoplayTimer);
  processAutoplayTimer = setTimeout(() => {
    if (!isDraggingProcess) showProcessCard(activeProcessCard + 1);
    scheduleProcessAutoplay();
  }, 5000);
}

function showProcessCard(index) {
  // Mantém o índice dentro do ciclo e reposiciona todos os cards ao redor do ativo.
  if (!processCards.length) return;
  activeProcessCard = (index + processCards.length) % processCards.length;

  processCards.forEach((card, cardIndex) => {
    let distance = cardIndex - activeProcessCard;
    const half = processCards.length / 2;
    if (distance > half) distance -= processCards.length;
    if (distance < -half) distance += processCards.length;

    // A distância define escala, opacidade, desfoque e ordem visual do card.
    const isActive = distance === 0;
    const distanceFromCenter = Math.abs(distance);
    gsap.to(card, {
      xPercent: distance * 78,
        x: 0,
        scale: isActive ? 1 : Math.max(0.7, 1 - distanceFromCenter * 0.14),
      opacity: isActive ? 1 : Math.max(0.18, 0.5 - distanceFromCenter * 0.14),
      filter: isActive ? "blur(0px)" : `blur(${distanceFromCenter * 2.5}px)`,
      zIndex: isActive ? 2 : 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true
    });
  });

  if (previousProcessButton) previousProcessButton.disabled = false;
  if (nextProcessButton) nextProcessButton.disabled = false;
}

nextProcessButton?.addEventListener("click", () => {
  // Avança manualmente e reinicia o tempo do autoplay.
  showProcessCard(activeProcessCard + 1, 1);
  scheduleProcessAutoplay();
});
previousProcessButton?.addEventListener("click", () => {
  showProcessCard(activeProcessCard - 1, -1);
  scheduleProcessAutoplay();
});

processGallery?.addEventListener("pointerdown", (event) => {
  // Inicia o arraste somente quando o toque não começou em um botão.
  if (event.target.closest("button")) return;

  isDraggingProcess = true;
  isHorizontalProcessDrag = false;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragLastX = event.clientX;
  dragLastTime = performance.now();
  dragDistance = 0;
  dragVelocity = 0;
  dragOriginIndex = activeProcessCard;
  dragPreviewIndex = activeProcessCard;
  clearTimeout(processAutoplayTimer);
  processGallery.classList.add("is-dragging");
  processGallery.setPointerCapture(event.pointerId);
});

processGallery?.addEventListener("pointermove", (event) => {
  // Atualiza a prévia do card enquanto o ponteiro se desloca horizontalmente.
  if (!isDraggingProcess) return;

  const now = performance.now();
  const delta = event.clientX - dragStartX;
  const verticalDelta = event.clientY - dragStartY;

  if (!isHorizontalProcessDrag) {
    // Aguarda um pequeno deslocamento para diferenciar arraste horizontal de rolagem vertical.
    if (Math.abs(delta) < 8 && Math.abs(verticalDelta) < 8) return;
    if (Math.abs(verticalDelta) > Math.abs(delta)) {
      isDraggingProcess = false;
      processGallery.classList.remove("is-dragging");
      processGallery.releasePointerCapture?.(event.pointerId);
      return;
    }
    isHorizontalProcessDrag = true;
  }

  const frameDistance = event.clientX - dragLastX;
  const frameTime = Math.max(now - dragLastTime, 1);
  dragDistance = delta;
  dragVelocity = frameDistance / frameTime;
  dragLastX = event.clientX;
  dragLastTime = now;

  const cardWidth = processCards[0]?.offsetWidth || 1;
  // Converte a distância do ponteiro em uma quantidade limitada de cards.
  const stepDistance = cardWidth * 0.42;
  const requestedSteps = Math.round(-delta / stepDistance);
  const boundedSteps = Math.max(-processCards.length + 1, Math.min(processCards.length - 1, requestedSteps));
  const nextPreviewIndex = (dragOriginIndex + boundedSteps + processCards.length) % processCards.length;

  if (nextPreviewIndex !== dragPreviewIndex) {
    dragPreviewIndex = nextPreviewIndex;
    showProcessCard(dragPreviewIndex);
  }

  const remainingDistance = delta + boundedSteps * stepDistance;
  processCards.forEach((card) => gsap.set(card, { x: remainingDistance }));
});

function finishProcessDrag(event) {
  // Decide se o gesto deve confirmar o próximo card ou retornar ao card atual.
  if (!isDraggingProcess) return;
  isDraggingProcess = false;
  processGallery.classList.remove("is-dragging");
  if (event.pointerId !== undefined && processGallery.hasPointerCapture?.(event.pointerId)) {
    processGallery.releasePointerCapture(event.pointerId);
  }

  if (!isHorizontalProcessDrag) {
    scheduleProcessAutoplay();
    return;
  }

  const cardWidth = processCards[0]?.offsetWidth || 1;
  const passedDistance = Math.abs(dragDistance) > cardWidth * 0.18;
  const passedVelocity = Math.abs(dragVelocity) > 0.45;

  if (!passedDistance && !passedVelocity) {
    // Movimentos curtos ou lentos são tratados como um toque sem troca de card.
    showProcessCard(activeProcessCard);
    return;
  }

  if (dragPreviewIndex === dragOriginIndex && Math.abs(dragVelocity) > 1.1) {
    showProcessCard(activeProcessCard + (dragDistance < 0 ? 1 : -1));
  } else {
    showProcessCard(dragPreviewIndex);
  }
  scheduleProcessAutoplay();
}

processGallery?.addEventListener("pointerup", finishProcessDrag);
processGallery?.addEventListener("pointercancel", finishProcessDrag);
window.addEventListener("pointerup", finishProcessDrag);
window.addEventListener("pointercancel", finishProcessDrag);
showProcessCard(0);
scheduleProcessAutoplay();

/* A galeria original com ScrollTrigger fica abaixo apenas como referência e está desativada. */
if (false) {
gsap.registerPlugin(ScrollTrigger, Draggable);

let iteration = 0; // Incrementa ao chegar ao início ou ao fim para manter a animação contínua.

// Define o estado inicial dos itens.
const processGallery = document.querySelector(".process-gallery");
const processCards = processGallery ? processGallery.querySelectorAll(".cards li") : [];

gsap.set(processCards, { xPercent: 400, opacity: 0, scale: 0 });

const spacing = 0.1, // Espaçamento entre os cards durante o escalonamento.
  snapTime = gsap.utils.snap(spacing), // Ajusta o tempo da animação aos intervalos definidos.
  cards = gsap.utils.toArray(processCards),
  // Cria a animação de cada card para inseri-la na linha do tempo principal.
	animateFunc = element => {
		const tl = gsap.timeline();
		tl.fromTo(element, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false})
		  .fromTo(element, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender: false}, 0);
		return tl;
	},
	seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc),
  playhead = {offset: 0}, // Objeto intermediário que representa a posição da animação.
  wrapTime = gsap.utils.wrap(0, seamlessLoop.duration()), // Mantém qualquer posição dentro da duração da animação.
  scrub = gsap.to(playhead, { // Reutiliza esta animação para mover a linha do tempo suavemente.
		offset: 0,
    onUpdate() {
      seamlessLoop.time(wrapTime(playhead.offset));
    },
    duration: 0.5,
    ease: "power3",
    paused: true
  }),
  trigger = ScrollTrigger.create({
    trigger: processGallery,
    start: "top top",
    onUpdate(self) {
      scrub.vars.offset = self.progress * seamlessLoop.duration();
      scrub.invalidate().restart();
    },
    end: "+=3000",
    pin: processGallery,
    anticipatePin: 1
  }),
  // Converte o progresso em uma posição de rolagem segura para detectar os limites.
  progressToScroll = progress => gsap.utils.clamp(0, trigger.end, progress * trigger.end);

// Recebe uma posição da linha do tempo e ajusta a rolagem correspondente.
function scrollToOffset(offset) { // Move a animação e volta ao início quando necessário.
  const lastOffset = seamlessLoop.duration() - 0.001;
  const snappedTime = gsap.utils.clamp(0, lastOffset, snapTime(offset));
  const progress = snappedTime / seamlessLoop.duration();
  trigger.scroll(progressToScroll(progress));
}


const nextProcessButton = document.querySelector(".process-gallery .next");
const previousProcessButton = document.querySelector(".process-gallery .prev");

nextProcessButton?.addEventListener("click", () => scrollToOffset(scrub.vars.offset + spacing));
previousProcessButton?.addEventListener("click", () => scrollToOffset(scrub.vars.offset - spacing));


// Configura o arraste dos cards, inclusive em dispositivos móveis.
Draggable.create(".process-gallery .drag-proxy", {
  type: "x",
  trigger: ".cards",
  onPress() {
    this.startOffset = scrub.vars.offset;
  },
  onDrag() {
    scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
    scrub.invalidate().restart();
  },
  onDragEnd() {
    scrollToOffset(scrub.vars.offset);
  }
});

scrub.vars.offset = 0;
scrub.invalidate().restart();

function buildSeamlessLoop(items, spacing, animateFunc) {
  let overlap = Math.ceil(1 / spacing), // Animações extras antes e depois garantem a continuidade do loop.
    startTime = items.length * spacing + 0.5, // Momento da sequência original em que o loop começa.
    loopTime = (items.length + overlap) * spacing + 1, // Ponto final que retorna ao momento inicial.
    rawSequence = gsap.timeline({paused: true}), // Linha do tempo que contém todas as animações reais.
    seamlessLoop = gsap.timeline({ // Linha do tempo que simula a repetição contínua.
			paused: true,
      repeat: -1, // Permite repetir a animação indefinidamente.
      onRepeat() { // Corrige um caso raro de repetição identificado no GSAP 3.6.1.
				this._time === this._dur && (this._tTime += this._dur - 0.01);
			}
		}),
		l = items.length + overlap * 2,
		time, i, index;

  // Cria as animações em sequência, incluindo itens extras para fechar o loop.
	for (i = 0; i < l; i++) {
		index = i % items.length;
		time = i * spacing;
		rawSequence.add(animateFunc(items[index]), time);
    i <= items.length && seamlessLoop.add("label" + i, time); // Marca pontos importantes para possíveis saltos na animação.
	}

  // Configura o movimento da linha do tempo para que o loop pareça contínuo.
	rawSequence.time(startTime);
	seamlessLoop.to(rawSequence, {
		time: loopTime,
		duration: loopTime - startTime,
		ease: "none"
	}).fromTo(rawSequence, {time: overlap * spacing + 1}, {
		time: startTime,
		duration: startTime - (overlap * spacing + 1),
		immediateRender: false,
		ease: "none"
	});
	return seamlessLoop;
}
}


/* Os cards de serviços mudam conforme o usuário navega pela seção clara. */
const servicesSection = document.querySelector(".services");
const serviceCards = servicesSection ? gsap.utils.toArray(".service-card", servicesSection) : [];
const serviceLabels = servicesSection ? gsap.utils.toArray(".service-labels span", servicesSection) : [];
const servicesCardsArea = servicesSection?.querySelector(".services-cards");
let activeServiceIndex = 0;
let serviceWheelLocked = false;
let servicePointerStartX = 0;
let servicePointerStartY = 0;
let servicePointerMoved = false;
let servicePointerActive = false;
let serviceIgnoreClick = false;

// Atualiza a posição, a escala e a transparência dos cards e dos rótulos.
if (servicesSection && serviceCards.length) {
  const updateServiceStack = (activeIndex) => {
    // Calcula a distância circular para conectar o primeiro e o último item.

    serviceCards.forEach((card, cardIndex) => {
      let distance = cardIndex - activeIndex;
      const half = serviceCards.length / 2;
      if (distance > half) distance -= serviceCards.length;
      if (distance < -half) distance += serviceCards.length;

      const depth = Math.min(distance, serviceCards.length - 1);
      gsap.to(card, {
        y: distance * 22,
        scale: 0.88,
        autoAlpha: Math.abs(distance) === 0 ? 1 : Math.abs(distance) === 1 ? 0.34 : 0,
        filter: `blur(${Math.abs(distance) * 1.4}px)`,
        zIndex: serviceCards.length - Math.abs(distance),
        duration: 0.32,
        ease: "power2.out",
        overwrite: true
      });
    });

    serviceLabels.forEach((label, labelIndex) => {
      // O rótulo ativo fica maior e nítido; os demais recuam visualmente.
      let distance = labelIndex - activeIndex;
      const half = serviceLabels.length / 2;
      if (distance > half) distance -= serviceLabels.length;
      if (distance < -half) distance += serviceLabels.length;

      const depth = Math.abs(distance);
      gsap.to(label, {
        y: distance * 30,
        scale: depth === 0 ? 1 : 0.82,
        autoAlpha: depth === 0 ? 1 : depth === 1 ? 0.38 : 0,
        filter: depth === 0 ? "blur(0px)" : `blur(${depth * 1.8}px)`,
        color: depth === 0 ? "#cf6882" : "#53675c",
        zIndex: serviceLabels.length - depth,
        duration: 0.32,
        ease: "power2.out",
        overwrite: true
      });
    });
  };

  const changeServiceCard = (direction) => {
    // Alterna o serviço e volta ao primeiro ao ultrapassar o último.
    activeServiceIndex = (activeServiceIndex + direction + serviceCards.length) % serviceCards.length;
    updateServiceStack(activeServiceIndex);
  };

  // Permite escolher diretamente um card ou um rótulo com o clique do mouse.
  const selectServiceCard = (target) => {
    const targetIndex = serviceCards.indexOf(target);
    if (targetIndex < 0) return;
    if (targetIndex === activeServiceIndex) {
      changeServiceCard(1);
    } else {
      activeServiceIndex = targetIndex;
      updateServiceStack(activeServiceIndex);
    }
  };

  servicesCardsArea?.addEventListener("pointerdown", (event) => {
    // Guarda o início do gesto e captura o ponteiro para acompanhar o dedo até o fim.
    if (event.pointerType === "mouse" && event.button !== 0) return;
    servicePointerStartX = event.clientX;
    servicePointerStartY = event.clientY;
    servicePointerMoved = false;
    servicePointerActive = true;
    servicesCardsArea.classList.add("is-dragging-service");
    servicesCardsArea.setPointerCapture?.(event.pointerId);
  });

  window.addEventListener("pointermove", (event) => {
    // Considera apenas deslocamentos horizontais como navegação entre cards.
    if (!servicePointerActive) return;
    const horizontalDistance = event.clientX - servicePointerStartX;
    const verticalDistance = event.clientY - servicePointerStartY;
    if (Math.abs(horizontalDistance) > 12 && Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      servicePointerMoved = true;
      event.preventDefault();
    }
  });

  window.addEventListener("pointerup", (event) => {
    if (!servicePointerActive) return;
    const horizontalDistance = event.clientX - servicePointerStartX;
    const verticalDistance = event.clientY - servicePointerStartY;
    servicesCardsArea.releasePointerCapture?.(event.pointerId);
    servicesCardsArea.classList.remove("is-dragging-service");
    servicePointerActive = false;

    if (servicePointerMoved && Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      // Arrastar para a esquerda avança; arrastar para a direita retorna ao card anterior.
      changeServiceCard(horizontalDistance < 0 ? 1 : -1);
      serviceIgnoreClick = true;
      window.setTimeout(() => {
        serviceIgnoreClick = false;
      }, 400);
    }
    servicePointerMoved = false;
  });

  window.addEventListener("pointercancel", () => {
    if (!servicePointerActive) return;
    servicePointerActive = false;
    servicePointerMoved = false;
    servicesCardsArea.classList.remove("is-dragging-service");
  });

  servicesCardsArea?.addEventListener("click", (event) => {
    // Não troca novamente quando o clique é consequência de um arraste no celular.
    if (serviceIgnoreClick) return;
    const clickedCard = event.target.closest(".service-card");
    if (clickedCard) selectServiceCard(clickedCard);
  });

  serviceLabels.forEach((label, labelIndex) => {
    label.addEventListener("click", () => {
      // Os nomes laterais também funcionam como atalhos para cada serviço.
      activeServiceIndex = labelIndex;
      updateServiceStack(activeServiceIndex);
    });
  });

  servicesCardsArea?.addEventListener("wheel", (event) => {
    // Usa a roda do mouse para trocar cards sem deixar a página avançar junto.
    if (!event.target.closest(".service-card")) return;
    event.preventDefault();
    if (serviceWheelLocked) return;

    serviceWheelLocked = true;
    changeServiceCard(event.deltaY > 0 ? 1 : -1);
    // Evita várias trocas causadas por um único movimento contínuo da roda.
    window.setTimeout(() => {
      serviceWheelLocked = false;
    }, 350);
  }, { passive: false });

  updateServiceStack(activeServiceIndex);
}


function animateHeroTitle(timeline) {
  const heroTitle = document.querySelector(".hero h1");
  if (!heroTitle || !window.SplitText || heroTitle.dataset.animated === "true") return;

  heroTitle.dataset.animated = "true";
  gsap.set(heroTitle, { opacity: 0, visibility: "hidden" });
  const splitTitle = SplitText.create(heroTitle, {
    type: "chars, words",
    charsClass: "hero-char"
  });

  gsap.set(splitTitle.chars, {
    opacity: 0,
    scale: 0,
    y: 70,
    rotationX: 100,
    transformOrigin: "50% 50% -40px"
  });
  gsap.set(heroTitle, { opacity: 1, visibility: "visible" });

  timeline.to(splitTitle.chars, {
    duration: 0.55,
    opacity: 1,
    scale: 1,
    y: 0,
    rotationX: 0,
    ease: "back.out(1.4)",
    stagger: 0.018,
    onComplete: () => {
      splitTitle.revert();
      heroTitle.removeAttribute("aria-hidden");
    }
  });
}

function animateHeroText(element, timeline, position = 0) {
  if (!element || !window.SplitText || element.dataset.animated === "true") return;

  element.dataset.animated = "true";
  const splitText = SplitText.create(element, {
    type: "chars, words",
    charsClass: "hero-copy-char"
  });

  gsap.set(element, { opacity: 1, visibility: "visible" });
  gsap.set(splitText.chars, {
    opacity: 0,
    y: 28,
    rotationX: 70,
    transformOrigin: "50% 50% -25px"
  });
  timeline.to(splitText.chars, {
    opacity: 1,
    y: 0,
    rotationX: 0,
    duration: 0.55,
    stagger: 0.014,
    ease: "back.out(1.25)",
    onComplete: () => splitText.revert()
  }, position);
}

function animateLandingEntrance() {
  if (!window.gsap || document.body.dataset.landingAnimated === "true") return;
  document.body.dataset.landingAnimated = "true";

  const logo = document.querySelector(".site-header .logo-link");
  const navigationLinks = gsap.utils.toArray(".site-header nav a");
  const headerAction = document.querySelector(".site-header > .button");
  const mobileMenu = document.querySelector(".site-header .menu");
  const heroActions = gsap.utils.toArray(".hero .actions > *");
  const heroVisual = document.querySelector(".hero-visual");
  const heroImage = document.querySelector(".hero-visual .image-frame");
  const visualDetails = gsap.utils.toArray(".hero-visual .kinetic-ring, .hero-visual .orbit, .hero-visual .float-note");
  const heroText = gsap.utils.toArray(".hero-copy .eyebrow, .hero-copy .lead, .hero-pillars strong, .hero-pillars span");
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  const headerItems = [logo, ...navigationLinks, headerAction, mobileMenu].filter(Boolean);
  gsap.set(headerItems, { opacity: 0, x: -55 });
  gsap.set(heroActions, { opacity: 0, x: -70 });
  gsap.set([heroVisual, heroImage, ...visualDetails].filter(Boolean), { opacity: 0, x: 90 });
  gsap.set(heroText, { opacity: 0, visibility: "hidden" });
  document.body.classList.remove("landing-pending");

  animateHeroTitle(timeline);
  heroText.forEach((element, index) => animateHeroText(element, timeline, index * 0.025));

  timeline.to(logo, { opacity: 1, x: 0, duration: 0.45 }, 0)
    .to(navigationLinks, { opacity: 1, x: 0, duration: 0.45, stagger: 0.08 }, 0.18)
    .to([headerAction, mobileMenu].filter(Boolean), { opacity: 1, x: 0, duration: 0.45 }, 0.5)
    .to(heroActions, { opacity: 1, x: 0, duration: 0.55, stagger: 0.1 }, 0.35)
    .to(heroVisual, { opacity: 1, x: 0, duration: 0.7 }, 0.25)
    .to(heroImage, { opacity: 1, x: 0, duration: 0.65 }, 0.32)
    .to(visualDetails, { opacity: 1, x: 0, duration: 0.55, stagger: 0.08 }, 0.45);
}

document.fonts.ready.then(() => {
  if (!introScreen) animateLandingEntrance();
});
