import { sanitize } from "../js/utils.js";

export function projectCard(project) {
  return `
    <div class="project-card" data-project-id="${project.id}">
      <div class="project-top">

        <div class="project-info">
          <div class="project-icon">${project.icon || "📁"}</div>

          <div>
            <div class="project-name">${sanitize(project.name)}</div>
            <div class="project-meta">${project.buttons.length} buttons</div>
          </div>
        </div>

        <div class="mini-actions">
          <button class="mini-btn rename-project" data-id="${project.id}">✏️</button>
          <button class="mini-btn delete-project" data-id="${project.id}">🗑️</button>
          <button class="mini-btn pin-project" data-id="${project.id}">📌</button>
        </div>

      </div>
    </div>
  `;
}

export function buttonCard(button) {
  return `
    <div class="button-card" data-button-id="${button.id}">
      <div class="button-title">${sanitize(button.name)}</div>

      <div class="button-actions">
        <button class="manage-btn" data-id="${button.id}">☰</button>
      </div>
    </div>
  `;
}

export function trustCard(project, index) {
  return `
    <div class="project-card">
      <div class="project-top">
        <div class="project-info">
          <div class="project-icon">${project.icon || "📁"}</div>

          <div>
            <div class="project-name">${sanitize(project.name)}</div>
            <div class="project-meta">${project.buttons.length} buttons</div>
          </div>
        </div>
      </div>

      <div class="modal-actions" style="margin-top:12px;">
        <button class="save-btn restore-project" data-index="${index}">
          Restore
        </button>

        <button class="cancel-btn delete-forever" data-index="${index}">
          Delete Permanently
        </button>
      </div>
    </div>
  `;
}