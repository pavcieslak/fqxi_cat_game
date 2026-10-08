function addNativeTooltips(root) {
  const zapButtons = new Set(root.querySelectorAll?.(".btn-zap") ?? []);
  if (root instanceof Element && root.matches(".btn-zap")) {
    zapButtons.add(root);
  }
  for (const button of zapButtons) {
    if (!button.hasAttribute("title")) {
      button.title = "Hold to Zap";
    }
  }

  const wrappers = new Set(root.querySelectorAll?.(".hud-tooltip-wrapper, .control-tooltip-wrapper") ?? []);
  if (root instanceof Element) {
    const containingWrapper = root.closest(".hud-tooltip-wrapper, .control-tooltip-wrapper");
    if (root.matches(".hud-tooltip-wrapper, .control-tooltip-wrapper")) {
      wrappers.add(root);
    }
    if (containingWrapper) {
      wrappers.add(containingWrapper);
    }
  }

  for (const wrapper of wrappers) {
    const button = wrapper.querySelector(":scope > button");
    const tooltip = button?.nextElementSibling;
    if (button && tooltip && !button.hasAttribute("title")) {
      const label = tooltip.textContent.trim();
      if (label) {
        button.title = label;
      }
    }
  }
}

addNativeTooltips(document);

const observer = new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node instanceof Element) {
        addNativeTooltips(node);
      }
    }
  }
});

observer.observe(document.documentElement, { childList: true, subtree: true });
