import {
  renderProjects,
  createProject,
  setCurrentProject,
  renderButtons,
  createButton,
  renderTrustBin
} from "./projects.js";

const dashboardScreen = document.getElementById("dashboardScreen");
const projectsTabScreen = document.getElementById("projectsTabScreen");
const projectScreen = document.getElementById("projectScreen");
const viewerScreen = document.getElementById("viewerScreen");

const viewerFrame = document.getElementById("viewerFrame");
const drawer = document.getElementById("sideDrawer");
const overlay = document.getElementById("drawerOverlay");

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
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

/* drawer */
document.getElementById("menuBtn")?.addEventListener("click", () => {
  drawer.classList.add("active");
  overlay.classList.add("active");
});

overlay?.addEventListener("click", () => {
  drawer.classList.remove("active");
  overlay.classList.remove("active");
});

/* create */
document.getElementById("quickCreateBtn")?.addEventListener("click", createProject);
document.getElementById("drawerCreateProject")?.addEventListener("click", createProject);
document.getElementById("projectsTabCreateBtn")?.addEventListener("click", createProject);
document.getElementById("addButtonBtn")?.addEventListener("click", createButton);

/* back */
document.getElementById("projectBackBtn")?.addEventListener("click", () => {
  showScreen(dashboardScreen);
});

document.getElementById("viewerBackBtn")?.addEventListener("click", () => {
  showScreen(projectScreen);
});

/* search */
document.getElementById("projectSearch")?.addEventListener("input", (e) => {
  renderProjects(e.target.value);
});

document.getElementById("projectsTabSearch")?.addEventListener("input", (e) => {
  renderProjects(e.target.value, "projectsTabGrid");
});

document.getElementById("buttonSearch")?.addEventListener("input", (e) => {
  renderButtons(e.target.value);
});

/* viewer */
document.getElementById("viewerMenuBtn")?.addEventListener("click", () => {
  window.open(viewerFrame.src, "_blank");
});

/* nav */
const navDashboard = document.getElementById("navDashboard");
const navProjects = document.getElementById("navProjects");
const navNotes = document.getElementById("navNotes");
const navWorkspace = document.getElementById("navWorkspace");
const navTrash = document.getElementById("navTrash");

function setActiveNav(btn) {
  document.querySelectorAll(".nav-btn").forEach(x => x.classList.remove("active"));
  btn.classList.add("active");
}

navDashboard?.addEventListener("click", () => {
  showScreen(dashboardScreen);
  setActiveNav(navDashboard);
});

navProjects?.addEventListener("click", () => {
  renderProjects("", "projectsTabGrid");
  showScreen(projectsTabScreen);
  setActiveNav(navProjects);
});

navNotes?.addEventListener("click", () => {
  showScreen(document.getElementById("notesScreen"));
  setActiveNav(navNotes);
});

navWorkspace?.addEventListener("click", () => {
  showScreen(document.getElementById("ideScreen"));
  setActiveNav(navWorkspace);
});

navTrash?.addEventListener("click", () => {
  renderTrustBin();
  showScreen(document.getElementById("trustBinScreen"));
  setActiveNav(navTrash);
});

/* init */
renderProjects();