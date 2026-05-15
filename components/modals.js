let modalRoot = null;

function getRoot() {
  if (!modalRoot) {
    modalRoot = document.getElementById("modalRoot");
  }
  return modalRoot;
}

export function closeModal() {
  const root = getRoot();
  if (!root) return;
  root.innerHTML = "";
}

export function openModal(content) {
  const root = getRoot();
  if (!root) return;

  root.innerHTML = `
    <div class="modal-overlay" id="modalOverlay">
      <div class="modal" id="modalBox">
        ${content}
      </div>
    </div>
  `;

  document.getElementById("modalOverlay")?.addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") {
      closeModal();
    }
  });
}

export function openConfirm({
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm = () => {}
}) {
  openModal(`
    <h3>${title}</h3>
    <p class="modal-text">${message}</p>

    <div class="modal-actions">
      <button class="cancel-btn" id="confirmCancelBtn">
        ${cancelText}
      </button>

      <button class="save-btn" id="confirmOkBtn">
        ${confirmText}
      </button>
    </div>
  `);

  document.getElementById("confirmCancelBtn")?.addEventListener("click", closeModal);

  document.getElementById("confirmOkBtn")?.addEventListener("click", () => {
    closeModal();
    onConfirm();
  });
}