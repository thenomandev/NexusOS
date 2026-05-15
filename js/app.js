import { loadApp, saveApp } from "./utils.js";
import { openModal, closeModal } from "../components/modals.js";
import { projectCard, emptyState } from "../components/ui.js";

const app = loadApp();

const dashboardScreen = document.getElementById("dashboardScreen");
const projectScreen = document.getElementById("projectScreen");
const viewerScreen = document.getElementById("viewerScreen");

const projectsGrid = document.getElementById("projectsGrid");

const drawer = document.getElementById("sideDrawer");
const overlay = document.getElementById("drawerOverlay");

const quickCreateBtn = document.getElementById("quickCreateBtn");
const drawerCreateProject = document.getElementById("drawerCreateProject");
const menuBtn = document.getElementById("menuBtn");

let currentProjectId = null;

function save() {
  saveApp(app);
}

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
  });

  screen.classList.add("active");
}

function openDrawer() {
  drawer.classList.add("active");
  overlay.classList.add("active");
}

function closeDrawer() {
  drawer.classList.remove("active");
  overlay.classList.remove("active");
}

function updateStats() {
  const totalButtons = app.projects.reduce(
    (sum, p) => sum + (p.buttons?.length || 0),
    0
  );

  document.getElementById("totalProjectsCount").textContent = app.projects.length;
  document.getElementById("totalButtonsCount").textContent = totalButtons;
  document.getElementById("trashCount").textContent = app.trashProjects.length;
}

function renderProjects() {
  if (!app.projects.length) {
    projectsGrid.innerHTML = emptyState(
      "No projects yet",
      "Create your first premium project"
    );
    updateStats();
    return;
  }

  projectsGrid.innerHTML = app.projects.map(projectCard).join("");

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      currentProjectId = card.dataset.projectId;
      openProject();
    });
  });

  updateStats();
}

function createProject() {
  closeDrawer();

  openModal(`
    <h3>Create Project</h3>
    <input id="projectNameInput" placeholder="Project name">
    <input id="projectIconInput" placeholder="Emoji icon (optional)">
    <div class="modal-actions">
      <button class="cancel-btn" id="cancelCreateBtn">Cancel</button>
      <button class="save-btn" id="saveCreateBtn">Create</button>
    </div>
  `);

  document.getElementById("cancelCreateBtn").onclick = closeModal;

  document.getElementById("saveCreateBtn").onclick = () => {
    const name = document.getElementById("projectNameInput").value.trim();
    const icon = document.getElementById("projectIconInput").value.trim();

    if (!name) return;

    app.projects.unshift({
      id: "p_" + Date.now(),
      name,
      icon: icon || "📁",
      buttons: [],
      pinned: false
    });

    save();
    closeModal();
    renderProjects();
  };
}

function openProject() {
  const project = app.projects.find(p => p.id === currentProjectId);
  if (!project) return;

  document.getElementById("projectTitle").textContent = project.name;
  document.getElementById("projectMeta").textContent =
    `${project.buttons.length} buttons`;

  showScreen(projectScreen);
}

menuBtn.onclick = openDrawer;
overlay.onclick = closeDrawer;

quickCreateBtn.onclick = createProject;
drawerCreateProject.onclick = createProject;

document.getElementById("projectBackBtn").onclick = () => {
  showScreen(dashboardScreen);
};

renderProjects();