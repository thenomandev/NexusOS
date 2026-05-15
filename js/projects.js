import { genId, saveLocal, loadLocal, normalizeUrl } from "./utils.js";
import { projectCard, buttonCard, trustCard } from "../components/ui.js";
import { openModal, closeModal } from "../components/modals.js";

const PROJECTS_KEY = "nexus_projects";
const TRASH_KEY = "nexus_trash";

let projects = loadLocal(PROJECTS_KEY, []);
let trash = loadLocal(TRASH_KEY, []);
let currentProjectId = null;

function save() {
  saveLocal(PROJECTS_KEY, projects);
  saveLocal(TRASH_KEY, trash);
}

export function setCurrentProject(id) {
  currentProjectId = id;
}

function getCurrentProject() {
  return projects.find(p => p.id === currentProjectId);
}

export function updateStats() {
  const totalButtons = projects.reduce((sum, p) => sum + p.buttons.length, 0);

  document.getElementById("totalProjectsCount").textContent = projects.length;
  document.getElementById("totalButtonsCount").textContent = totalButtons;
  document.getElementById("totalNotesCount").textContent = "0";
  document.getElementById("trashCount").textContent = trash.length;
}

export function createProject() {
  openModal(`
    <h3>Create Project</h3>
    <input id="projectNameInput" placeholder="Project name">
    <div class="modal-actions">
      <button class="cancel-btn" id="cancelBtn">Cancel</button>
      <button class="save-btn" id="saveBtn">Create</button>
    </div>
  `);

  document.getElementById("cancelBtn").onclick = closeModal;

  document.getElementById("saveBtn").onclick = () => {
    const name = document.getElementById("projectNameInput").value.trim();
    if (!name) return;

    projects.unshift({
      id: genId(),
      name,
      icon: "📁",
      pinned: false,
      buttons: []
    });

    save();
    closeModal();
    renderProjects();
    updateStats();
  };
}

export function renderProjects(search = "", targetId = "projectsGrid") {
  const grid = document.getElementById(targetId);
  if (!grid) return;

  let list = [...projects];

  if (search) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  list.sort((a, b) => Number(b.pinned) - Number(a.pinned));

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
  const project = projects.find(p => p.id === id);
  if (!project) return;

  openModal(`
    <h3>Edit Project</h3>
    <input id="renameInput" value="${project.name}">
    <div class="modal-actions">
      <button class="cancel-btn" id="cancelRename">Cancel</button>
      <button class="save-btn" id="saveRename">Save</button>
    </div>
  `);

  document.getElementById("cancelRename").onclick = closeModal;

  document.getElementById("saveRename").onclick = () => {
    const val = document.getElementById("renameInput").value.trim();
    if (!val) return;

    project.name = val;

    save();
    closeModal();
    renderProjects();
  };
}

function deleteProject(id) {
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return;

  trash.unshift(projects[idx]);
  projects.splice(idx, 1);

  save();
  renderProjects();
  renderTrustBin();
}

function togglePin(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  project.pinned = !project.pinned;

  save();
  renderProjects();
}

export function renderButtons(search = "") {
  const project = getCurrentProject();
  const grid = document.getElementById("buttonsGrid");

  if (!project || !grid) return;

  let buttons = [...project.buttons];

  if (search) {
    buttons = buttons.filter(btn =>
      btn.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  grid.innerHTML = buttons.map(buttonCard).join("");

  document.getElementById("projectTitle").textContent = project.name;
  document.getElementById("projectMeta").textContent = `${project.buttons.length} buttons`;

  bindButtonActions();
}

function bindButtonActions() {
  const project = getCurrentProject();
  if (!project) return;

  document.querySelectorAll(".button-card").forEach(card => {
    card.onclick = () => {
      const btn = project.buttons.find(x => x.id === card.dataset.buttonId);
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

export function createButton() {
  const project = getCurrentProject();
  if (!project) return;

  openModal(`
    <h3>Add Button</h3>
    <input id="btnName" placeholder="Button name">
    <input id="btnUrl" placeholder="https://example.com">
    <div class="modal-actions">
      <button class="cancel-btn" id="cancelButton">Cancel</button>
      <button class="save-btn" id="saveButton">Create</button>
    </div>
  `);

  document.getElementById("cancelButton").onclick = closeModal;

  document.getElementById("saveButton").onclick = () => {
    const name = document.getElementById("btnName").value.trim();
    const url = document.getElementById("btnUrl").value.trim();

    if (!name || !url) return;

    project.buttons.unshift({
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

function openButtonManage(id) {
  const project = getCurrentProject();
  if (!project) return;

  const btn = project.buttons.find(x => x.id === id);
  if (!btn) return;

  openModal(`
    <h3>Manage Button</h3>
    <div class="drawer-menu">
      <button id="editBtn">Edit Button</button>
      <button id="deleteBtn">Delete Button</button>
      <button id="openBtn">Open External</button>
    </div>
  `);

  document.getElementById("editBtn").onclick = () => editButton(btn);
  document.getElementById("deleteBtn").onclick = () => deleteButton(btn.id);
  document.getElementById("openBtn").onclick = () => window.open(normalizeUrl(btn.url), "_blank");
}

function editButton(btn) {
  openModal(`
    <h3>Edit Button</h3>
    <input id="editBtnName" value="${btn.name}">
    <input id="editBtnUrl" value="${btn.url}">
    <div class="modal-actions">
      <button class="cancel-btn" id="cancelEditBtn">Cancel</button>
      <button class="save-btn" id="saveEditBtn">Save</button>
    </div>
  `);

  document.getElementById("cancelEditBtn").onclick = closeModal;

  document.getElementById("saveEditBtn").onclick = () => {
    const name = document.getElementById("editBtnName").value.trim();
    const url = document.getElementById("editBtnUrl").value.trim();

    if (!name || !url) return;

    btn.name = name;
    btn.url = url;

    save();
    closeModal();
    renderButtons();
  };
}

function deleteButton(id) {
  const project = getCurrentProject();
  if (!project) return;

  const idx = project.buttons.findIndex(x => x.id === id);
  if (idx === -1) return;

  project.buttons.splice(idx, 1);

  save();
  closeModal();
  renderButtons();
  updateStats();
}

export function renderTrustBin() {
  const grid = document.getElementById("trustBinGrid");
  if (!grid) return;

  grid.innerHTML = trash.map((project, index) =>
    trustCard(project, index)
  ).join("");

  document.querySelectorAll(".restore-project").forEach(btn => {
    btn.onclick = () => {
      const i = Number(btn.dataset.index);
      projects.unshift(trash[i]);
      trash.splice(i, 1);

      save();
      renderTrustBin();
      renderProjects();
      updateStats();
    };
  });

  document.querySelectorAll(".delete-forever").forEach(btn => {
    btn.onclick = () => {
      const i = Number(btn.dataset.index);
      trash.splice(i, 1);

      save();
      renderTrustBin();
      updateStats();
    };
  });
}