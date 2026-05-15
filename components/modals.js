export function openModal(content) {
  const root = document.getElementById("modalRoot");
  root.innerHTML = `
    <div class="modal-overlay">
      <div class="modal">
        ${content}
      </div>
    </div>
  `;

  root.querySelector(".modal-overlay").addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  });
}

export function closeModal() {
  document.getElementById("modalRoot").innerHTML = "";
}