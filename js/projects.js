import { genId, saveLocal, loadLocal, sanitize, normalizeUrl } from "./utils.js";

const PROJECTS_KEY = "nexusos_projects";
const TRASH_KEY = "nexusos_project_trash";
const BUTTON_TRASH_KEY = "nexusos_button_trash";

let projects = loadLocal(PROJECTS_KEY, []);
let projectTrash = loadLocal(TRASH_KEY, []);
let buttonTrash = loadLocal(BUTTON_TRASH_KEY, []);
let currentProjectId = null;
let currentView = "dashboard";

function save() {
  saveLocal(PROJECTS_KEY, projects);
  saveLocal(TRASH_KEY, projectTrash);
  saveLocal(BUTTON_TRASH_KEY, buttonTrash);
}

function getCurrentProject() {
  return projects.find(p => p.id === currentProjectId);
}

export function setView(view) {
  currentView = view;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

export function updateStats() {
  const totalButtons = projects.reduce((sum, p) => sum + (p.buttons?.length || 0), 0);

  const p = document.getElementById("totalProjectsCount");
  const b = document.getElementById("totalButtonsCount");
  const n = document.getElementById("totalNotesCount");
  const t = document.getElementById("trashCount");

  if (p) p.textContent = projects.length;
  if (b) b.textContent = totalButtons;
  if (n) n.textContent = "0";
  if (t) t.textContent = projectTrash.length;
}

export function createProject() {
  const name = prompt("Project name?");
  if (!name) return;

  projects.unshift({
    id: genId(),
    name: sanitize(name),
    icon: "📁",
    buttons: []
  });

  save();
  renderProjects();
  updateStats();
}

export function renderProjects(search = "", targetId = "projectList") {
  const container = document.getElementById(targetId);
  if (!container) return;

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  container.innerHTML = filtered.map(project => `
    <div class="project-card">
      <div class="project-info" onclick="window.openProject('${project.id}')">
        <div class="project-icon">${project.icon}</div>
        <div>
          <div class="project-name">${project.name}</div>
          <div class="project-meta">${project.buttons.length} buttons</div>
        </div>
      </div>

      <div class="project-actions">
        <button onclick="window.editProject('${project.id}')">✏️</button>
        <button onclick="window.deleteProject('${project.id}')">🗑️</button>
      </div>
    </div>
  `).join("");
}

export function editProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const name = prompt("Edit project name", project.name);
  if (!name) return;

  project.name = sanitize(name);
  save();
  renderProjects();
}

export function deleteProject(id) {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return;

  projectTrash.unshift(projects[index]);
  projects.splice(index, 1);

  save();
  renderProjects();
  renderTrustBin();
  updateStats();
}

export function openProject(id) {
  currentProjectId = id;
  const project = getCurrentProject();
  if (!project) return;

  showScreen("projectScreen");

  const title = document.getElementById("currentProjectName");
  const count = document.getElementById("currentProjectCount");

  if (title) title.textContent = project.name;
  if (count) count.textContent = `${project.buttons.length} buttons`;

  renderButtons();
}

export function createButton() {
  const project = getCurrentProject();
  if (!project) return;

  const title = prompt("Button title?");
  const url = prompt("Button URL?");

  if (!title || !url) return;

  project.buttons.unshift({
    id: genId(),
    title: sanitize(title),
    url: normalizeUrl(url)
  });

  save();
  renderButtons();
  updateStats();
}

export function renderButtons() {
  const project = getCurrentProject();
  const container = document.getElementById("buttonList");
  if (!project || !container) return;

  container.innerHTML = project.buttons.map(btn => `
    <div class="button-card" onclick="window.open('${btn.url}','_blank')">
      <span>${btn.title}</span>
      <button onclick="event.stopPropagation(); window.deleteButton('${btn.id}')">☰</button>
    </div>
  `).join("");
}

export function deleteButton(id) {
  const project = getCurrentProject();
  if (!project) return;

  const idx = project.buttons.findIndex(x => x.id === id);
  if (idx === -1) return;

  buttonTrash.unshift({
    ...project.buttons[idx],
    projectName: project.name
  });

  project.buttons.splice(idx, 1);

  save();
  renderButtons();
  updateStats();
}

export function renderTrustBin() {
  const container = document.getElementById("trustBinList");
  if (!container) return;

  container.innerHTML = projectTrash.map((p, i) => `
    <div class="trash-card">
      <div>${p.name}</div>
      <div class="trash-actions">
        <button onclick="window.restoreProject(${i})">Restore</button>
        <button onclick="window.permanentDelete(${i})">Delete Permanently</button>
      </div>
    </div>
  `).join("");
}

export function restoreProject(index) {
  const item = projectTrash[index];
  if (!item) return;

  projects.unshift(item);
  projectTrash.splice(index, 1);

  save();
  renderProjects();
  renderTrustBin();
  updateStats();
}

export function permanentDelete(index) {
  projectTrash.splice(index, 1);

  save();
  renderTrustBin();
  updateStats();
}

window.openProject = openProject;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.deleteButton = deleteButton;
window.restoreProject = restoreProject;
window.permanentDelete = permanentDelete;