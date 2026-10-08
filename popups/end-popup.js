// Renders popups/end-popup.html templates into a container and wires data-action buttons.
(function () {
  const NEXT_LABELS = { 1: "Two", 2: "Three", 3: "Four" };
  const ready = fetch("/fqxi/popups/end-popup.html")
    .then((r) => r.text())
    .then((html) => {
      const holder = document.createElement("div");
      holder.innerHTML = html;
      return holder;
    });

  window.EndPopup = {
    // opts: { won, level, onRestart, onNext, onMenu }
    render(container, opts) {
      ready.then((holder) => {
        const tpl = holder.querySelector(opts.won ? "#popup-win" : "#popup-lose");
        if (!tpl || !container.isConnected) return;
        container.replaceChildren(tpl.content.cloneNode(true));
        const label = container.querySelector("[data-next-label]");
        if (label) label.textContent = NEXT_LABELS[opts.level] || "";
        const handlers = { restart: opts.onRestart, next: opts.onNext, menu: opts.onMenu };
        container.querySelectorAll("[data-action]").forEach((el) => {
          if (el.dataset.action === "next" && !(opts.won && opts.level < 4)) return el.remove();
          el.addEventListener("click", () => handlers[el.dataset.action]?.());
        });
      });
    },
  };
})();
