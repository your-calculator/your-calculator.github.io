const ICONS = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

// === Toast utility ===
function getToastContainer() {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = "info") {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = ICONS[type] || "";
  toast.innerText = `${icon} ${message}`;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove after 3s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showCustomDialog(message, type = "info") {
  return new Promise((resolve) => {
    // Create overlay + box
    const overlay = document.createElement("div");
    overlay.className = "custom-dialog-overlay";

    const box = document.createElement("div");
    box.className = "custom-dialog-box";

    // Content (scrollable)
    const content = document.createElement("div");
    content.className = "custom-dialog-content";

    // Use a container for message. We allow HTML (so <br/> works).
    // If message may contain untrusted input, sanitize it first.
    const msg = document.createElement("div");
    msg.className = "dialog-message";
    msg.innerHTML = `${ICONS[type] || ""} ${message}`; // message can contain <br/> or HTML

    content.appendChild(msg);

    // Actions (fixed at bottom of dialog)
    const actions = document.createElement("div");
    actions.className = "custom-dialog-actions";
    const okBtn = document.createElement("button");
    okBtn.type = "button";
    okBtn.innerText = "OK";
    okBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
      resolve(true);
    });
    actions.appendChild(okBtn);

    // assemble
    box.appendChild(content);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // OPTIONAL: focus the button so keyboard users can press Enter
    okBtn.focus();
  });
}
