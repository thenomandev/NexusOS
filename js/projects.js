import { genId, saveLocal, loadLocal, normalizeUrl, copyText } from "./utils.js";
import { projectCard, buttonCard } from "../components/ui.js";
import { openModal, closeModal } from "../components/modals.js";

const PROJECTS_KEY = "nexusos_projects";
const TRASH_KEY = "nexusos_project_trash";
const BUTTON_TRASH_KEY = "nexusos_button_trash";

let projects = loadLocal(PROJECTS_KEY, []);
let projectTrash = loadLocal(TRASH_KEY, []);
let buttonTrash = loadLocal(BUTTON_TRASH_KEY, []);

let currentProjectId = null;
let gridMode = true;

function save() {
  saveLocal(PROJECTS_KEY, projects);
  saveLocal(TRASH_KEY, projectTrash);
  saveLocal(BUTTON_TRASH_KEY, buttonTrash);
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

export function renderProjects(filter = "", targetId = "projectsGrid") {
  const grid = document.getElementById(targetId);
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

if(currentProjectId === id){
  currentProjectId = null;
}

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

      const finalUrl = normalizeUrl(btn.url);

      import("./app.js").then(m => m.openViewer(finalUrl));
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

  buttonTrash.push({
    ...project.buttons[idx],
    projectName: project.name
  });
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

export function renderTrustBin() {
  const screen = document.getElementById("trustBinScreen");
  if (!screen) return;

  let html = `
    <div class="topbar">
      <div class="brand">
        <div class="brand-logo">🗑</div>
        <div>
          <h1>Trust Bin</h1>
          <p>deleted projects & buttons</p>
        </div>
      </div>
    </div>
  `;

  if (!projectTrash.length) {
    html += `
      <div class="coming-soon">
        <h2>Empty Trust Bin</h2>
        <p>No deleted projects</p>
      </div>
    `;
  } else {
    html += `<div class="projects-grid">`;

    projectTrash.forEach((p, index) => {
      html += `
        <div class="project-card">
          <div class="project-top">
            <div class="project-info">
              <div class="project-icon">${p.icon || "📁"}</div>
              <div>
                <div class="project-name">${p.name}</div>
                <div class="project-meta">${p.buttons?.length || 0} buttons</div>
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
    });

    html += `</div>`;
  }

  screen.innerHTML = html;

  document.querySelectorAll(".restore-project").forEach(btn=>{
    btn.onclick = ()=>{
      const i = Number(btn.dataset.index);
      projects.push(projectTrash[i]);
      projectTrash.splice(i,1);
      save();
      renderTrustBin();
      renderProjects();
    };
  });

  document.querySelectorAll(".delete-forever").forEach(btn=>{
    btn.onclick = ()=>{
      const i = Number(btn.dataset.index);
      projectTrash.splice(i,1);
      save();
      renderTrustBin();
    };
  });
}

function updateStats() {
  const totalButtons = projects.reduce((sum, p) => sum + p.buttons.length, 0);

  document.getElementById("totalProjectsCount").textContent = projects.length;
  document.getElementById("totalButtonsCount").textContent = totalButtons;
  document.getElementById("trashCount").textContent = projectTrash.length;
}