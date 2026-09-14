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
