export function openModal(content) {
  const root = document.getElementById("modalRoot");

  root.innerHTML = `
    <div class="modal-overlay">
      <div class="modal">
        ${content}
      </div>
    </div>
  `;

  const overlay = root.querySelector(".modal-overlay");

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
}

export function closeModal() {
  const root = document.getElementById("modalRoot");
  if (root) root.innerHTML = "";
}