import { sanitize } from "../js/utils.js";

export function projectCard(project) {
  return `
    <div class="project-card" data-project-id="${project.id}">
      <div class="project-top">

        <div class="project-info">
          <div class="project-icon">
            ${sanitize(project.icon || "📁")}
          </div>

          <div class="project-text">
            <div class="project-name">
              ${sanitize(project.name)}
            </div>

            <div class="project-meta">
              ${project.buttons?.length || 0} buttons
            </div>
          </div>
        </div>

        <button
          class="manage-btn project-manage-btn"
          data-project-manage="${project.id}"
        >
          ☰
        </button>

      </div>
    </div>
  `;
}

export function buttonCard(button, styleClass = "") {
  return `
    <div class="button-card ${styleClass}" data-button-id="${button.id}">
      <div class="button-title">
        ${sanitize(button.name)}
      </div>

      <button
        class="manage-btn button-manage-btn"
        data-button-manage="${button.id}"
      >
        ☰
      </button>
    </div>
  `;
}

export function emptyState(title, subtitle) {
  return `
    <div class="empty-card">
      <div class="empty-icon">✨</div>
      <h3>${sanitize(title)}</h3>
      <p>${sanitize(subtitle)}</p>
    </div>
  `;
}