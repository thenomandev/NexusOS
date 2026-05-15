import { genId, saveLocal, loadLocal, normalizeUrl, copyText } from "./utils.js";
import { projectCard, buttonCard } from "../components/ui.js";
import { openModal, closeModal } from "../components/modals.js";

const PROJECTS_KEY = "nexusos_projects";
const TRASH_KEY = "nexusos_project_trash";

let projects = loadLocal(PROJECTS_KEY, []);
let projectTrash = loadLocal(TRASH_KEY, []);

let currentProjectId = null;
let gridMode = true;

function save() {
  saveLocal(PROJECTS_KEY, projects);
  saveLocal(TRASH_KEY, projectTrash);
}

export function getProjects() {
  return projects;
}

export function getProjectTrash() {
  return projectTrash;
}

export function getCurrentProject() {
  return projects.find(p => p.id === currentProjectId);
}

export function setCurrentProject(id) {
  currentProjectId = id;
}

export function createProject() {
  openModal(`
    <h3>Create Project</h3>
    <input id="projectNameInput" placeholder="Project name">
    <input id="projectIconInput" placeholder="Project emoji/icon (optional)">
    <div class="modal-actions">
      <button class="cancel-btn" id="cancelCreateProject">Cancel</button>
      <button class="save-btn" id="saveCreateProject">Create</button>
    </div>
  `);

  document.getElementById("cancelCreateProject").onclick = closeModal;

  document.getElementById("saveCreateProject").onclick = () => {
    const name = document.getElementById("projectNameInput").value.trim();
    const icon = document.getElementById("projectIconInput").value.trim();

    if (!name) return;

    projects.push({
      id: genId(),
      name,
      icon: icon || "📁",
      pinned: false,
      buttons: [],
      buttonTrash: []
    });

    save();
    closeModal();
    renderProjects();
  };
}

export function renderProjects(filter = "") {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  let list = [...projects];

  list.sort((a, b) => b.pinned - a.pinned);

  if (filter) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  grid.innerHTML = list.map(projectCard).join("");

  bindProjectActions();
  updateStats();
}

function bindProjectActions() {
  document.querySelectorAll(".project-card").forEach(card => {
    card.onclick = () => {
      import("./app.js").then(m => m.openProject(card.dataset.projectId));
    };
  });

  document.querySelectorAll(".rename-project").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      renameProject(btn.dataset.id);
    };
  });

  document.querySelectorAll(".delete-project").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      deleteProject(btn.dataset.id);
    };
  });

  document.querySelectorAll(".pin-project").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      togglePin(btn.dataset.id);
    };
  });
}

function renameProject(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;

  openModal(`
    <h3>Edit Project</h3>
    <input id="renameProjectInput" value="${p.name}">
    <div class="modal-actions">
      <button class="cancel-btn" id="cancelRenameProject">Cancel</button>
      <button class="save-btn" id="saveRenameProject">Save</button>
    </div>
  `);

  document.getElementById("cancelRenameProject").onclick = closeModal;

  document.getElementById("saveRenameProject").onclick = () => {
    p.name = document.getElementById("renameProjectInput").value.trim() || p.name;
    save();
    closeModal();
    renderProjects();
  };
}

function deleteProject(id) {
  const idx = projects.findIndex(x => x.id === id);
  if (idx === -1) return;

  projectTrash.push(projects[idx]);
  projects.splice(idx, 1);

  save();
  renderProjects();
}

function togglePin(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;

  p.pinned = !p.pinned;
  save();
  renderProjects();
}

export function renderButtons() {
  const project = getCurrentProject();
  const grid = document.getElementById("buttonsGrid");

  if (!project || !grid) return;

  grid.className = gridMode ? "buttons-grid" : "buttons-grid list-mode";

  grid.innerHTML = project.buttons.map((btn, i) => buttonCard(btn, i)).join("");

  document.getElementById("projectTitle").textContent = project.name;
  document.getElementById("projectMeta").textContent = `${project.buttons.length} buttons`;

  bindButtonActions();
}

function bindButtonActions() {
  const project = getCurrentProject();
  if (!project) return;

  document.querySelectorAll(".button-card").forEach(card => {
    card.onclick = () => {
      const id = card.dataset.buttonId;
      const btn = project.buttons.find(x => x.id === id);
      if (!btn) return;

      import("./app.js").then(m => m.openViewer(normalizeUrl(btn.url)));
    };
  });

  document.querySelectorAll(".manage-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      openButtonManage(btn.dataset.id);
    };
  });
}

function openButtonManage(id) {
  const project = getCurrentProject();
  const btn = project.buttons.find(x => x.id === id);
  if (!btn) return;

  openModal(`
    <h3>Manage Button</h3>
    <div class="drawer-menu">
      <button id="editButtonBtn">Edit Button</button>
      <button id="copyButtonBtn">Copy Link</button>
      <button id="externalButtonBtn">Open External</button>
      <button id="trashButtonBtn">Move to Trust Bin</button>
    </div>
  `);

  document.getElementById("editButtonBtn").onclick = () => editButton(btn);
  document.getElementById("copyButtonBtn").onclick = () => copyText(btn.url);
  document.getElementById("externalButtonBtn").onclick = () => window.open(normalizeUrl(btn.url), "_blank");
  document.getElementById("trashButtonBtn").onclick = () => moveButtonToTrash(btn.id);
}

function editButton(btn) {
  openModal(`
    <h3>Edit Button</h3>
    <input id="editButtonName" value="${btn.name}">
    <input id="editButtonUrl" value="${btn.url}">
    <div class="modal-actions">
      <button class="cancel-btn" id="cancelEditButton">Cancel</button>
      <button class="save-btn" id="saveEditButton">Save</button>
    </div>
  `);

  document.getElementById("cancelEditButton").onclick = closeModal;

  document.getElementById("saveEditButton").onclick = () => {
    btn.name = document.getElementById("editButtonName").value.trim() || btn.name;
    btn.url = document.getElementById("editButtonUrl").value.trim() || btn.url;

    save();
    closeModal();
    renderButtons();
  };
}

function moveButtonToTrash(id) {
  const project = getCurrentProject();
  const idx = project.buttons.findIndex(x => x.id === id);
  if (idx === -1) return;

  project.buttonTrash.push(project.buttons[idx]);
  project.buttons.splice(idx, 1);

  save();
  closeModal();
  renderButtons();
}

export function createButton() {
  const project = getCurrentProject();
  if (!project) return;

  openModal(`
    <h3>Add Button</h3>
    <input id="buttonNameInput" placeholder="Button name">
    <input id="buttonUrlInput" placeholder="https://example.com">
    <div class="modal-actions">
      <button class="cancel-btn" id="cancelCreateButton">Cancel</button>
      <button class="save-btn" id="saveCreateButton">Create</button>
    </div>
  `);

  document.getElementById("cancelCreateButton").onclick = closeModal;

  document.getElementById("saveCreateButton").onclick = () => {
    const name = document.getElementById("buttonNameInput").value.trim();
    const url = document.getElementById("buttonUrlInput").value.trim();

    if (!name || !url) return;

    project.buttons.push({
      id: genId(),
      name,
      url
    });

    save();
    closeModal();
    renderButtons();
    updateStats();
  };
}

export function toggleViewMode() {
  gridMode = !gridMode;
  document.getElementById("toggleViewBtn").textContent = gridMode ? "List View" : "Grid View";
  renderButtons();
}

function updateStats() {
  const totalButtons = projects.reduce((sum, p) => sum + p.buttons.length, 0);

  document.getElementById("totalProjectsCount").textContent = projects.length;
  document.getElementById("totalButtonsCount").textContent = totalButtons;
  document.getElementById("trashCount").textContent = projectTrash.length;
}