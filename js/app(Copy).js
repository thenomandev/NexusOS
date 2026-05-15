import {
  renderProjects,
  createProject,
  setCurrentProject,
  renderButtons,
  createButton,
  toggleViewMode
} from "./projects.js";

const dashboardScreen = document.getElementById("dashboardScreen");
const projectScreen = document.getElementById("projectScreen");
const viewerScreen = document.getElementById("viewerScreen");

const drawer = document.getElementById("sideDrawer");
const overlay = document.getElementById("drawerOverlay");

const viewerFrame = document.getElementById("viewerFrame");

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

export function openProject(projectId) {
  setCurrentProject(projectId);
  renderButtons();
  showScreen(projectScreen);
}

export function openViewer(url) {
  viewerFrame.src = url;
  showScreen(viewerScreen);
}

function backToDashboard() {
  showScreen(dashboardScreen);
}

function backToProject() {
  showScreen(projectScreen);
}

document.getElementById("menuBtn").onclick = openDrawer;
overlay.onclick = closeDrawer;

document.getElementById("quickCreateBtn").onclick = createProject;
document.getElementById("drawerCreateProject").onclick = createProject;

document.getElementById("projectBackBtn").onclick = backToDashboard;
document.getElementById("viewerBackBtn").onclick = backToProject;

document.getElementById("toggleViewBtn").onclick = toggleViewMode;
document.getElementById("addButtonBtn").onclick = createButton;

document.getElementById("projectSearch").addEventListener("input", (e) => {
  renderProjects(e.target.value);
});

document.getElementById("viewerMenuBtn").onclick = () => {
  window.open(viewerFrame.src, "_blank");
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../service-worker.js");
}

renderProjects();