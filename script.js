document.addEventListener("DOMContentLoaded", function () {
  const bingoTable    = document.getElementById("bingo-table").querySelector("tbody");
  const selectedList  = document.getElementById("selected-list");
  const resetButton   = document.getElementById("reset-button");
  const fullscreenBtn = document.getElementById("fullscreen-button");
  const bingoAnimBtn  = document.getElementById("bingo-animation-button");
  const lastBadge     = document.getElementById("last-number-badge");

  let selectedNumbers = [];
  let lastNumber      = null;

  /* ─────────────────────────────────────────
     Gera tabela de bingo (5 linhas × 15 cols)
  ───────────────────────────────────────── */
  for (let i = 0; i < 5; i++) {
    const row = document.createElement("tr");
    for (let j = 1; j <= 15; j++) {
      const cell   = document.createElement("td");
      const number = i * 15 + j;
      cell.textContent = number;
      cell.dataset.number = number;

      cell.addEventListener("click", function () {
        if (!cell.classList.contains("selected")) {
          cell.classList.add("selected");
          selectedNumbers.push(number);
          setLastNumber(number);
        } else {
          cell.classList.remove("selected");
          selectedNumbers = selectedNumbers.filter(n => n !== number);

          // Atualiza badge: mostra o último que ainda está selecionado
          const newLast = selectedNumbers.length
            ? selectedNumbers[selectedNumbers.length - 1]
            : null;
          setLastNumber(newLast);
        }
        updateSelectedList();
      });

      row.appendChild(cell);
    }
    bingoTable.appendChild(row);
  }

  /* ─────────────────────────────────────────
     Atualiza badge "Último Número"
  ───────────────────────────────────────── */
  function setLastNumber(number) {
    lastNumber = number;
    lastBadge.classList.remove("pop");
    void lastBadge.offsetWidth; // reflow para reiniciar animação
    lastBadge.textContent = number !== null ? number : "—";
    lastBadge.classList.add("pop");
  }

  /* ─────────────────────────────────────────
     Atualiza lista de números selecionados
  ───────────────────────────────────────── */
  function updateSelectedList() {
    selectedList.innerHTML = "";
    selectedNumbers.forEach(number => {
      const li = document.createElement("li");
      li.textContent = number;
      selectedList.appendChild(li);
    });

    // Rola para o último elemento adicionado
    if (selectedList.lastChild) {
      selectedList.lastChild.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  }

  /* ─────────────────────────────────────────
     Botão Reset
  ───────────────────────────────────────── */
  resetButton.addEventListener("click", function () {
    selectedNumbers = [];
    lastNumber = null;
    updateSelectedList();
    setLastNumber(null);
    document.querySelectorAll("#bingo-table td").forEach(cell => {
      cell.classList.remove("selected");
    });
  });

  /* ─────────────────────────────────────────────────────
     Botão Fullscreen — toggle confiável
     1. Sempre alterna a classe CSS (funciona em qualquer contexto)
     2. Tenta a API nativa como bônus (funciona se o browser permitir)
  ───────────────────────────────────────────────────── */
  let isFullscreen = false;

  function setFullscreenMode(active) {
    isFullscreen = active;
    const icon = fullscreenBtn.querySelector(".btn-icon");
    if (active) {
      document.body.classList.add("fullscreen-mode");
      if (icon) icon.textContent = "✕";
    } else {
      document.body.classList.remove("fullscreen-mode");
      if (icon) icon.textContent = "⛶";
    }
  }

  fullscreenBtn.addEventListener("click", function () {
    if (!isFullscreen) {
      // Ativa o layout fullscreen imediatamente
      setFullscreenMode(true);
      // Tenta API nativa como bônus (pode falhar em alguns contextos — ok)
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      // Desativa o layout fullscreen
      setFullscreenMode(false);
      // Sai do fullscreen nativo se estava ativo
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  });

  // Sincroniza quando o usuário sai do fullscreen nativo via ESC ou F11
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && isFullscreen) {
      setFullscreenMode(false);
    }
  });


  /* ─────────────────────────────────────────
     Botão Animação BINGO
  ───────────────────────────────────────── */
  bingoAnimBtn.addEventListener("click", function () {
    triggerBingoAnimation();
  });

  function triggerBingoAnimation() {
    // Remove overlay anterior se existir
    let overlay = document.getElementById("bingo-animation");
    if (overlay) overlay.remove();

    // Cria overlay BINGO!
    overlay = document.createElement("div");
    overlay.id = "bingo-animation";
    overlay.textContent = "BINGO!";
    Object.assign(overlay.style, {
      position:        "fixed",
      top:             "50%",
      left:            "50%",
      transform:       "translate(-50%, -50%)",
      fontSize:        "clamp(80px, 18vw, 260px)",
      fontFamily:      "'Fredoka One', cursive",
      background:      "linear-gradient(135deg, #fff700, #ff8c00, #ff2d00, #ff00aa)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor:  "transparent",
      backgroundClip:  "text",
      color:           "transparent",
      fontWeight:      "bold",
      zIndex:          "1000",
      pointerEvents:   "none",
      animation:       "bingoFlash 0.7s ease-in-out 0s 6",
      filter:          "drop-shadow(0 0 24px rgba(255, 200, 0, 0.8))",
    });
    document.body.appendChild(overlay);

    // Confetti
    spawnConfetti();

    overlay.addEventListener("animationend", () => {
      overlay.remove();
    }, { once: true });
  }

  /* ─────────────────────────────────────────
     Confetti Premium
  ───────────────────────────────────────── */
  function spawnConfetti() {
    // Remove container anterior
    const old = document.getElementById("confetti-container");
    if (old) old.remove();

    const container = document.createElement("div");
    container.id = "confetti-container";
    document.body.appendChild(container);

    const colors = [
      "#ff4500", "#ffd700", "#e91e8c", "#00e5ff",
      "#ff8f00", "#76ff03", "#d500f9", "#ff1744",
      "#ffea00", "#00e676",
    ];

    const shapes = ["circle", "square", "triangle"];

    for (let i = 0; i < 120; i++) {
      const piece    = document.createElement("div");
      const shape    = shapes[Math.floor(Math.random() * shapes.length)];
      const color    = colors[Math.floor(Math.random() * colors.length)];
      const size     = Math.random() * 14 + 6; // 6–20px
      const duration = (Math.random() * 2.5 + 2).toFixed(2); // 2–4.5s
      const delay    = (Math.random() * 2).toFixed(2);
      const xStart   = Math.random() * 100;
      const xDrift   = (Math.random() - 0.5) * 200; // ±100px drift

      piece.classList.add("confetti-piece");

      Object.assign(piece.style, {
        left:              xStart + "vw",
        width:             size + "px",
        height:            size + "px",
        backgroundColor:   shape !== "triangle" ? color : "transparent",
        animationDuration: duration + "s",
        animationDelay:    delay + "s",
        "--x-drift":       xDrift + "px",
      });

      if (shape === "circle") {
        piece.style.borderRadius = "50%";
      } else if (shape === "triangle") {
        piece.style.width  = "0";
        piece.style.height = "0";
        piece.style.backgroundColor = "transparent";
        piece.style.borderLeft   = size / 2 + "px solid transparent";
        piece.style.borderRight  = size / 2 + "px solid transparent";
        piece.style.borderBottom = size + "px solid " + color;
      }

      container.appendChild(piece);
    }

    // Remove o container após a animação mais longa (~7s)
    setTimeout(() => container.remove(), 7000);
  }
});
